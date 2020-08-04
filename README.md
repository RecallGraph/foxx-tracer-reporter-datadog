# foxx-tracer-reporter-datadog
A reporter for the [foxx-tracer-collector](https://github.com/RecallGraph/foxx-tracer-collector) service, that pushes spans to Datadog.

## Installation
This package is already available in the collector by default. See the collector docs for how to enable it.

## Configuration
The collector must declare a configuration setting named `dd-agent-url`. This is the location of the HTTP endpoint where [Datadog Agent](https://docs.datadoghq.com/agent/) is listening for span records (for example, `http://localhost:8126/v0.4/traces`).

This setting is already available in the collector by default.
