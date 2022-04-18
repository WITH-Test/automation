import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {BuildConfig} from "./build-config";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import {Repository} from "aws-cdk-lib/aws-ecr";

export class InfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps, buildConfig: BuildConfig) {
        super(scope, id, props);

        const appName = buildConfig.App.replace(' ', '')
        const names = {
            vpc: appName + 'Vpc',
            cluster: buildConfig.BranchName.replace('/', '-') + 'Cluster',
            service: appName + buildConfig.Part + "Service",
        }

        const vpc = new ec2.Vpc(this, names.vpc, {
            maxAzs: 3 // Default is all AZs in region
        });

        const cluster = new ecs.Cluster(this, names.cluster, {
            vpc: vpc
        });

        // const image = `${buildConfig.Image.Registry}/${buildConfig.Image.Repo}:${buildConfig.Version}`
        const repoName = buildConfig.App.replace(" ", '-')
        const repo = new Repository(this, buildConfig.Image.Repo, {
            repositoryName: buildConfig.Image.Repo,
            removalPolicy: RemovalPolicy.RETAIN,
        })

        // Create a load-balanced Fargate service and make it public
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, names.service, {
            cluster: cluster, // Required
            cpu: 256, // Default is 256
            desiredCount: 1, // Default is 1
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(repo, buildConfig.Version),
                containerName: `${appName}-${buildConfig.Part}`,
                containerPort: 8000,
            },
            memoryLimitMiB: 512, // Default is 512
            publicLoadBalancer: true, // Default is false
        });

        // The code that defines your stack goes here

        // example resource
        // const queue = new sqs.Queue(this, 'InfrastructureQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
    }
}
