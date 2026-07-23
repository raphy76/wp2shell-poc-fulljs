# WordPress CVE Logical Flow Demonstration

## Overview

This project allows to reproduce the logical flow related to CVE-2026-63030 and CVE-2026-60137 leading to an sql injection serving as a base to finally trigger a RCE in WordPress.

- **CVE-2026-63030**
- **CVE-2026-60137**

The demonstration illustrates how these vulnerabilities can be chained to reach an **SQL injection**, which can then serve as a stepping stone toward triggering **Remote Code Execution (RCE)** in a WordPress environment.

## Usage

Simply open the `index.html` file in your preferred web browser:

```bash
open index.html
