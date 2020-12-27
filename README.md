# Advanced Async Templates for OpenFaaS

A collection of modern, opinionated, templates for various languages.

These templates all make use of [of-watchdog](https://github.com/openfaas-incubator/of-watchdog) in conjunction with a fast, asynchronous REST framework.  The images all all based on Alpine Linux and strive to use the latest stable versions of the underlying technologies.

To get started using the templates you can run:

```shell
faas-cli template pull https://github.com/fbriden/openfaas-aat
```

and then follow the instructions for the specific language below

## Templates Currently Offered


| Template                            | Runtime | Web Server |
| ----------------------------------- | ------- | ---------- |
| [Typescript](./template/typescript) | TS Node | Express    |

