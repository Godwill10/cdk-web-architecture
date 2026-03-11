import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2, aws_rds as rds } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface ServerStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
}

export class ServerStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ServerStackProps) {
        super(scope, id, props);

        const vpc = props.vpc;

        const webSG = new ec2.SecurityGroup(this, 'WebSG', {
            vpc,
            allowAllOutbound: true
        });

        webSG.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'Allow HTTP'
        );

        const dbSG = new ec2.SecurityGroup(this, 'DBSG', {
            vpc
        });

        dbSG.addIngressRule(
            webSG,
            ec2.Port.tcp(3306),
            'Allow MySQL from web servers'
        );

        const publicSubnets = vpc.selectSubnets({
            subnetType: ec2.SubnetType.PUBLIC
        });

        publicSubnets.subnets.forEach((subnet, index) => {

            new ec2.Instance(this, `WebServer${index}`, {
                vpc,
                instanceType: new ec2.InstanceType('t2.micro'),
                machineImage: ec2.MachineImage.latestAmazonLinux(),
                vpcSubnets: { subnets: [subnet] },
                securityGroup: webSG
            });

        });

        new rds.DatabaseInstance(this, 'MySQLDB', {
            engine: rds.DatabaseInstanceEngine.mysql({
                version: rds.MysqlEngineVersion.VER_8_0
            }),
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
            },
            securityGroups: [dbSG],
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T3,
                ec2.InstanceSize.MICRO
            ),
            allocatedStorage: 20
        });

    }
}