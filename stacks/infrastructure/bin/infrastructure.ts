#!/usr/bin/env node
import 'source-map-support/register';
import * as core from '@actions/core'
import { App, Tags } from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import * as fs from 'fs'
import * as path from "path";
import {BuildConfig} from "../lib/build-config";
import * as yaml from "js-yaml";

const app = new App();


function ensureString(object: { [name: string]: any }, propName: string ): string {
    if(!object[propName] || object[propName].trim().length === 0)
        throw new Error(propName +" does not exist or is empty");

    return object[propName];
}

async function actionConfigFile() {
    let cfg : string = ""
    try {
        cfg = core.getInput('CDK_CONFIG_FILE')
        core.debug(`Using config file ${cfg}`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

        core.debug(new Date().toTimeString())

    } catch (error) {
        // if (error instanceof Error) core.setFailed(error.message)
        if (error instanceof Error) console.error(error.message)
    }
    return cfg
}

async function localConfigFile() {
    return "/home/carlos/Downloads/aws_infra.yml"
}


async function getBuildConfig(file: string) {

    console.log(`using file ${file}`)
    let unparsedEnv: any = yaml.load(fs.readFileSync(path.resolve(file), "utf8"));

    let buildConfig: BuildConfig = {

        App: ensureString(unparsedEnv, 'App'),
        Part: unparsedEnv['Part'],
        Version: ensureString(unparsedEnv, 'Version'),
        Environment: ensureString(unparsedEnv, 'Environment'),
        Build: ensureString(unparsedEnv, 'Build'),
        BranchName: ensureString(unparsedEnv, 'BranchName'),

        AWSAccount: {
            AccountID: ensureString(unparsedEnv["AWSAccount"], 'AccountID'),
            Region: ensureString(unparsedEnv["AWSAccount"], "Region")
        },

        Image: {
            Registry: ensureString(unparsedEnv["Image"], "Registry"),
            Repo: ensureString(unparsedEnv["Image"], "Repo"),
        }
    };

    return buildConfig;
}

async function getConfigFile() {
    let cfg :string = await actionConfigFile()
    if (!cfg) {
        cfg = await localConfigFile()
    }
    return cfg
}


async function Main()
{
    const cfgFile: string = await getConfigFile()
    let buildConfig: BuildConfig = await getBuildConfig(cfgFile)

    Tags.of(app).add('App', buildConfig.App);
    Tags.of(app).add('Version', buildConfig.Version);
    Tags.of(app).add('Branch', buildConfig.BranchName);

    const appName = buildConfig.App.replace(" ", "-")
    const branchName = buildConfig.BranchName.replace("/", "-")
    let stackName = `${appName}-${branchName}`;
    const mainStack = new InfrastructureStack(app, stackName.toLowerCase(),
        {
            env:
                {
                    region: buildConfig.AWSAccount.Region,
                    account: buildConfig.AWSAccount.AccountID,
                }
        }, buildConfig);
}

Main();
