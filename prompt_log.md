# iflow CLI 提示词日志

## 使用说明
本文件记录每次使用 iflow CLI (心流 CLI) 进行开发时的提示词，方便日后查阅和 AI 使用披露。

---

## 日志条目

### 2026-02-11 - 生成 AGENTS.md 项目上下文文档
**日期：** 2026-02-11

**提示词：**
```
You are an AI agent that brings the power of iFlow directly into the terminal. Your task is to analyze the current directory and generate a comprehensive AGENTS.md file to be used as instructional context for future interactions.

**Important: Please respond to the user in Chinese by default, unless they specifically request another language.**

**Analysis Process:**

1.  **Initial Exploration:**
    *   Start by listing the files and directories to get a high-level overview of the structure.
    *   Read the README file (e.g., `README.md`, `README.txt`) if it exists. This is often the best place to start.

2.  **Iterative Deep Dive (up to 10 files):**
    *   Based on your initial findings, select a few files that seem most important (e.g., configuration files, main source files, documentation).
    *   Read them. As you learn more, refine your understanding and decide which files to read next. You don't need to decide all 10 files at once. Let your discoveries guide your exploration.

3.  **Identify Project Type:**
    *   **Code Project:** Look for clues like `package.json`, `requirements.txt`, `pom.xml`, `go.mod`, `Cargo.toml`, `build.gradle`, or a `src` directory. If you find them, this is likely a software project.
    *   **Non-Code Project:** If you don't find code-related files, this might be a directory for documentation, research papers, notes, or something else.

**Context File Content Generation:**

**For a Code Project:**

*   **Project Overview:** Write a clear and concise summary of the project's purpose, main technologies, and architecture.
*   **Building and Running:** Document the key commands for building, running, and testing the project. Infer these from the files you've read (e.g., `scripts` in `package.json`, `Makefile`, etc.). If you can't find explicit commands, provide a placeholder with a TODO.
*   **Development Conventions:** Describe any coding styles, testing practices, or contribution guidelines you can infer from the codebase.

**For a Non-Code Project:**

*   **Directory Overview:** Describe the purpose and contents of the directory. What is it for? What kind of information does it hold?
*   **Key Files:** List the most important files and briefly explain what they contain.
*   **Usage:** Explain how the contents of this directory are intended to be used.

**Final Output:**

Write the complete content to the `AGENTS.md` file. The output must be well-formatted Markdown.
```

**用途：** 分析项目目录并生成 AGENTS.md 上下文文档

**模型：** glm-4.7

**结果：** 成功生成 AGENTS.md 文件，包含项目概述、技术栈、开发要求等关键信息

---

### 2026-02-11 - 审查开发计划并创建提示词日志
**日期：** 2026-02-11

**提示词：**
```
好的，请看一下 plan.md 开发计划，感觉有什么要补充的或修改的，并且要做一个日志文件存储每次的提示词
```

**用途：** 审查 plan.md 开发计划，提出补充建议，并创建提示词日志文件

**模型：** glm-4.7

**结果：**
- 已创建 prompt_log.md 提示词日志文件
- 已补充 plan.md 开发计划，新增以下内容：
  - 技术架构设计（合约层和前端层详细说明）
  - 安全性考虑（数据隐私、访问控制、防篡改、私钥管理）
  - 部署流程（本地开发→合约部署→前端部署→主网部署）
  - 时间规划（10天开发时间表）

---

### 2026-02-11 - 根据计划执行项目开发
**日期：** 2026-02-11

**提示词：**
```
好的，现在万事俱备，请根据计划写一份开发计划的具体计划和步骤，然后一步一步的执行开发此项目。注意一些细节要求要确认清楚。
```

**用途：** 根据计划执行项目开发，逐步完成 Move 合约和前端开发

**模型：** glm-4.7

**结果：**
- 已确认项目细节：
  - 项目名称：ClassmateVault
  - 前端框架：React + Vite
  - UI组件库：Tailwind CSS
  - 加密方案：钱包签名加密
  - 签到周期：自定义
- 已完成项目结构创建
- 已初始化 Git 仓库
- 已开发 Move 合约模块：
  - 班级通讯录模块（classmate.move）
  - 生前赠款模块（promise.move）
- 已完成前端基础框架：
  - React + Vite + TypeScript 项目初始化
  - Tailwind CSS 配置
  - 中英文切换功能（i18n）
  - 网络切换功能（testnet/mainnet）
  - 加密工具（crypto.ts）
  - 基础页面布局
- 前端构建验证通过

---
- 所有敏感信息已进行脱敏处理
- 每次使用 iflow CLI 后，请及时在此文件中记录
- 此文件将用于黑客松的 AI 使用披露