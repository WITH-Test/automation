export interface BuildConfig {
    readonly App: string
    readonly Part? : string
    readonly Version : string
    readonly Environment : string
    readonly Build : string
    readonly BranchName : string

    readonly AWSAccount : AWSAccount
    readonly Image: Image
}

export interface AWSAccount {
    readonly AccountID : string
    readonly Region: string
}

export interface Image {
    readonly Repo : string
    readonly Registry : string
}
