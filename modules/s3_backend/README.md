# Terraform AWS S3 Backend

Interesting blog post series: https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa 

Create an encrypted, private, version-controlled S3 bucket to use as Terraform backend
to store `state` files. To prevent concurrent modification of the same `state` file by
more than one `terraform` process concurrently, a DynamoDB table is created to use as 
locking for the state.
