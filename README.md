## What is VersaLog.js?

What is VersaLog.js?
VersaLog is a powerful and flexible logging library for JavaScript.
It supports everything from simple usage to advanced, highly customizable configurations to meet a wide range of needs.

## Installation

```
npm i versalog
```

### Mode

| Mode         |Description                                   |
| ------------ | -------------------------------------------- |
| `detailed`   | Logs including execution time and log levels |
| `file`       | Logs with filename and line number           |
| `simple`     | Simple and easy-to-read logs                 |

### Options

| Options      |Description                                   |
| ------------ | --------------------------------------------------------------          |
| `show_file`  | True : Display filename and line number (for simple and detailed modes) |
| `show_tag`   | True : Show self.tag if no explicit tag is provided                     |
| `tag`        | Default tag to use when show_tag is enabled                             |
| `all`        | Shortcut to enable both show_file and show_tag                          |

## Sample

**Simple** : [Tap](https://github.com/kayu0514/VersaLog.js/blob/main/tests/simple_test.js)  
**Detailed** : [Tap](https://github.com/kayu0514/VersaLog.js/blob/main/tests/detailed_test.js)
**File** : [Tap](https://github.com/kayu0514/VersaLog.js/blob/main/tests/file_test.js)
