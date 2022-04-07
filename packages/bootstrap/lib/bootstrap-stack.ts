import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {OpenIdConnectProvider} from "aws-cdk-lib/aws-iam";

export class BootstrapStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Create an Identity provider for GitHub inside your AWS Account. This
     * allows GitHub to present itself to AWS IAM and assume a role.
     */
    const provider = new OpenIdConnectProvider(this, 'MyProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })
  }
}
