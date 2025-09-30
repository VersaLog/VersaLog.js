## What is VersaLog.js?

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm version](https://img.shields.io/npm/v/versalog.svg?style=flat-square)](https://www.npmjs.com/package/versalog)
[![npm downloads](https://img.shields.io/npm/dm/versalog.svg?style=flat-square)](https://www.npmjs.com/package/versalog)
[![npm downloads](https://img.shields.io/npm/dt/versalog.svg?style=flat-square)](https://www.npmjs.com/package/versalog)

What is VersaLog.js?
VersaLog is a powerful and flexible logging library for JavaScript.
It supports everything from simple usage to advanced, highly customizable configurations to meet a wide range of needs.

## Installation

```
npm i versalog
```

### Enum

| Enum       | Description                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| `detailed` | Logs including execution time and log levels                                 |
| `file`     | Logs with filename and line number                                           |
| `simple`   | Simple and easy-to-read logs                                                 |
| `simple2`  | Simple and easy-to-read log format. The timestamp is automatically included. |

### Options

| Options            | Description                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `show_file`        | True : Display filename and line number (for simple and detailed modes)                                                                                                         |
| `show_tag`         | True : Show self.tag if no explicit tag is provided                                                                                                                             |
| `tag`              | Default tag to use when show_tag is enabled                                                                                                                                     |
| `enable_all`       | Shortcut to enable both show_file and show_tag                                                                                                                                  |
| `notice`           | True : When an error or critical level log is output, a desktop notification (using plyer.notification) will be displayed. The notification includes the log level and message. |
| `all_save`         | True : When an error or critical level log is output, the log will be saved to a file.                                                                                          |
| `save_levels`      | A list of log levels to save. Defaults to ["INFO", "ERROR", "WARNING", "DEBUG", "CRITICAL"].                                                                                    |
| `silent`           | True : Suppress standard output (print)                                                                                                                                         |
| `catch_exceptions` | True : Automatically catch unhandled exceptions and log them as critical                                                                                                        |

## Log save

```
[2025-08-06 04:10:36][INFO] : ok
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kaedeek"><img src="https://avatars.githubusercontent.com/u/170544738?v=4?s=100" width="100px;" alt="ₖₐₑ𝒹ₑ"/><br /><sub><b>ₖₐₑ𝒹ₑ</b></sub></a><br /><a href="https://github.com/kayu0514/VersaLog.js/commits?author=kaedeek" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
