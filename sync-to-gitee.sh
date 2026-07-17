#!/bin/bash
# 同步 GitHub 代码到 Gitee 并触发 Pages 部署

set -e

GITEE_TOKEN="9afbb79d3e95b3f7a677a15e6293de48"
GITEE_REPO="zhouzhou0602/personnel-dashboard"
GITEE_BRANCH="main"

echo "==> 1. 同步代码到 Gitee..."
git push gitee $GITEE_BRANCH --force

echo ""
echo "==> 2. 触发 Gitee Pages 重新部署..."
result=$(curl -s -X POST "https://gitee.com/api/v5/repos/$GITEE_REPO/pages/builds?access_token=$GITEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"branch\":\"$GITEE_BRANCH\"}")

echo "$result" | head -c 500
echo ""
echo ""
echo "==> 完成！访问地址：https://zhouzhou0602.gitee.io/personnel-dashboard"
echo "==> 注意：Gitee Pages 需要到网页端手动启动服务（首次）"
