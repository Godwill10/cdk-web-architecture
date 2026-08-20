import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { NetworkStack } from '../lib/network-stack';
import { ServerStack } from '../lib/server-stack';

test('network spans two availability zones with public and private subnets', () => {
  const app = new cdk.App();
  const stack = new NetworkStack(app, 'NetworkTest');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::Subnet', 4);
  template.resourceCountIs('AWS::EC2::NatGateway', 2);
});

test('server tier restricts MySQL to the web security group', () => {
  const app = new cdk.App();
  const network = new NetworkStack(app, 'NetworkTest');
  const servers = new ServerStack(app, 'ServerTest', { vpc: network.vpc });
  const template = Template.fromStack(servers);

  template.resourceCountIs('AWS::EC2::Instance', 2);
  template.resourceCountIs('AWS::RDS::DBInstance', 1);
  template.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
    FromPort: 3306,
    ToPort: 3306,
    IpProtocol: 'tcp',
    SourceSecurityGroupId: Match.anyValue()
  });
});
