#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { ServerStack } from '../lib/server-stack';

const app = new cdk.App();

const network = new NetworkStack(app, 'NetworkStack');

new ServerStack(app, 'ServerStack', {
    vpc: network.vpc
});