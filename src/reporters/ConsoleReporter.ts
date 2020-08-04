import { SpanData, reporters } from 'foxx-tracer';
import { inspect } from 'util';

export default class ConsoleReporter implements reporters.Reporter {
  private static readonly FORMAT_OPTIONS = {
    depth: Infinity,
    maxArrayLength: Infinity,
    breakLength: Infinity,
    compact: true,
    sorted: true
  };

  report(traces: SpanData[][]): void {
    console.log(inspect(traces, ConsoleReporter.FORMAT_OPTIONS));
  }
}