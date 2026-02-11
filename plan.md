听闻sui vibe 黑客松马上就要截止了，赶忙打开电脑，准备提交你的项目。
首先新建一个文件夹，命名为"classmate"。
# 制定好计划：
1. 前端展现目的和需求。
2. 参考要求和资料。
3. 配合的合约。

## 前端展现目的和需求
* 目的：找一个死前值得托付的人，在设定好的时间里不签到就自动转账给他。
* 从之前的"死了吗"项目获得一个灵感，就是web3也适合做这种app。
* 建立一个班级通讯录，可以添加同学信息，并能显示出来。
* 同学信息包括姓名、学号和联系方式（除了学校、班级、其他都是自己的加密信息）。
* 同学信息可以加密存储在链上，但前端展示时需要解密。
* 然后汇聚成一个学校、班级群组。
* 用户可以找到以前的至交好友。
* 最后，可以设定类似ruok3这种项目，自己在设定好的时间里不签到就自动转账，相当于一笔赠款。

## 代码要求
Smart contracts must use the latest Move syntax
• Move version requirement: 2024
• Contracts that do not comply with the current Move 2024 specification will not be reviewed

## sdk要求
Projects must use the latest version of the official Sui SDK
• Including but not limited to:
◦ Sui SDK (TypeScript / Rust, etc.)
• Deprecated official interfaces must not be used

## AI工具使用要求
AI Usage Disclosure (Mandatory)
If AI tools were used at any stage (including but not limited to code generation, content generation, agents, automation, etc.), full disclosure is required:
AI tool names used
Example: ChatGPT, Claude, Cursor, Copilot, etc.
Model names / versions
Exact prompts given to the AI
Multiple prompts are allowed
Sensitive information may be redacted
Projects that do not disclose AI usage or provide false disclosure will be disqualified from participation or awards.

## 参考要求和资料
sui move的语法最新2024要点参考：
https://docs.sui.io/concepts/sui-move-concepts/move-2024-migration
sui的skills参考：
https://github.com/RandyPen/sui-eco-skills
sui apis参考：
https://docs.sui.io/sui-api-ref#suix_getallbalances
sui前端使用dapp-kit参考：
https://sdk.mystenlabs.com/dapp-kit
参考一些编译成功的项目，比如：
https://github.com/summertoo/ruok
ruok项目就是前端能正常运行，合约端编译成功，也能在sui上运行。

## 有几个方面要考虑
1.项目命名，一个好听容易记得的名字很重要。
2.项目介绍，简洁明了。
3.目录结构要求，工程根目录建立2个文件夹，分别是"contracts"和"frontend"。
4.项目先走testnet，再走mainnet。所以要在前端页面上可以自由切换。
5.中英文界面也要自由切换。
6.做好git管理

## 技术架构设计
### 合约层（Move 2024）
- **Classmate Registry**：班级通讯录合约
  - create_classroom：创建班级
  - add_student：添加学生信息（加密存储）
  - update_student：更新学生信息
  - get_students：获取班级学生列表
- **Alive Check**：存活检查合约
  - create_promise：创建生前赠款承诺
  - check_in：签到，重置计时器
  - claim_gift：在超时后，受托人领取赠款
- **Encryption Helper**：加密辅助模块
  - 加密/解密联系人信息

### 前端层（React + Sui dapp-kit）
- **页面结构**
  - 首页：项目介绍
  - 班级管理：创建/加入班级
  - 通讯录：查看/添加同学信息
  - 生前赠款：设置/管理生前赠款
  - 签到页面：定期签到
- **状态管理**
  - 当前网络（testnet/mainnet）
  - 语言设置（中/英）
  - 用户钱包连接状态

## 安全性考虑
1. **数据隐私**：联系人信息使用用户密钥加密后上链
2. **访问控制**：只有班级成员可以查看班级通讯录
3. **防篡改**：所有操作在链上记录，不可篡改
4. **私钥管理**：建议用户使用硬件钱包或安全密钥管理工具

## 部署流程
1. **本地开发**：在 Sui testnet 上测试所有功能
2. **合约部署**：
   - 编译 Move 合约
   - 部署到 testnet
   - 验证功能
3. **前端部署**：
   - 构建生产版本
   - 部署到 Vercel/Netlify
4. **主网部署**：
   - 审计合约代码
   - 部署到 Sui mainnet
   - 更新前端配置

## 时间规划
- 第1-2天：合约开发（班级通讯录）
- 第3-4天：合约开发（生前赠款功能）
- 第5-7天：前端页面开发
- 第8天：testnet 集成测试
- 第9天：代码优化和文档完善
- 第10天：主网部署和提交

## 主要工具使用iflow
每次使用的提示词要做一个记录备份，方便日后查阅。