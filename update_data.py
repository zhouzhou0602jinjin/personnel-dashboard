import json
import pandas as pd

# 读取当前JSON
with open('src/data/personnel-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 读取底表
df = pd.read_excel('人员数据自动化看板底表.xlsx', sheet_name='总人员')
join_df = pd.read_excel('人员数据自动化看板底表.xlsx', sheet_name='本月入职人员')
leave_df = pd.read_excel('人员数据自动化看板底表.xlsx', sheet_name='本月离职人员')

join_df['入职日期'] = pd.to_datetime(join_df['入职日期'])
leave_df['离职日期'] = pd.to_datetime(leave_df['离职日期'])

fulltime = df[df['用工类型'] == '全职']

# 7月累计
join_july = join_df[(join_df['入职日期'] >= '2026-07-01') & (join_df['入职日期'] <= '2026-07-31')]
leave_july = leave_df[(leave_df['离职日期'] >= '2026-07-01') & (leave_df['离职日期'] <= '2026-07-31')]

# 本周 7/13-7/19
start_week = pd.Timestamp('2026-07-13')
end_week = pd.Timestamp('2026-07-19')
weekly_join = join_df[(join_df['入职日期'] >= start_week) & (join_df['入职日期'] <= end_week)]
weekly_leave = leave_df[(leave_df['离职日期'] >= start_week) & (leave_df['离职日期'] <= end_week)]

# ========== 更新 updateDate ==========
data['updateDate'] = '2026年7月19日'

# ========== 更新 analysisNotes ==========
data['analysisNotes'] = [
    {
        "month": "7月",
        "notes": [
            "入职最多：中小微事业群（14人），其次为产研中心（6人）"
        ]
    }
]

# ========== 辅助函数 ==========
def update_monthly(org_list, month, updates):
    for item in org_list:
        if item['month'] == month:
            item.update(updates)
            return

def update_org_monthly(org_name, month, updates):
    for org in data['organizations']:
        if org['name'] == org_name:
            update_monthly(org['monthly'], month, updates)
            return

def update_zxw_dept(dept_name, month, updates):
    for dept in data['zxwSubDepartments']:
        if dept['name'] == dept_name:
            update_monthly(dept['monthly'], month, updates)
            return

# ========== Company Total ==========
total_ft = len(fulltime)
total_intern = len(df[df['用工类型'] == '实习'])
total_jc = len(join_july)
total_lc = len(leave_july)
total_wjc = len(weekly_join)
total_wlc = len(weekly_leave)

update_monthly(data['companyTotal'], '7月', {
    'startCount': total_ft + total_intern,
    'fullTime': total_ft,
    'intern': total_intern,
    'joinCount': total_jc,
    'leaveCount': total_lc,
    'netChange': total_jc - total_lc,
    'weeklyJoinCount': total_wjc,
    'weeklyLeaveCount': total_wlc,
})

# ========== Organizations ==========
org_stats = {}
for org_name in ['产研中心', '有度税智', '职能中台', '中小微事业群', '数科中心', '总经办', '福鹿事业部']:
    ft = len(fulltime[fulltime['一级组织'] == org_name])
    intern = len(df[(df['一级组织'] == org_name) & (df['用工类型'] == '实习')])
    jc = len(join_july[join_july['一级组织'] == org_name])
    lc = len(leave_july[leave_july['一级组织'] == org_name])
    wjc = len(weekly_join[weekly_join['一级组织'] == org_name])
    wlc = len(weekly_leave[weekly_leave['一级组织'] == org_name])
    org_stats[org_name] = {
        'startCount': ft + intern,
        'fullTime': ft,
        'intern': intern,
        'joinCount': jc,
        'leaveCount': lc,
        'netChange': jc - lc,
        'weeklyJoinCount': wjc,
        'weeklyLeaveCount': wlc,
    }

# 十角兽
sjs_ft = len(fulltime[fulltime['一级组织'] == '十角兽'])
sjs_intern = len(df[(df['一级组织'] == '十角兽') & (df['用工类型'] == '实习')])
org_stats['十角兽'] = {
    'startCount': sjs_ft + sjs_intern,
    'fullTime': sjs_ft,
    'intern': sjs_intern,
    'joinCount': 0,
    'leaveCount': 0,
    'netChange': 0,
    'weeklyJoinCount': 0,
    'weeklyLeaveCount': 0,
}

for org_name, stats in org_stats.items():
    update_org_monthly(org_name, '7月', stats)

# ========== zxwSubTotal ==========
zxw_ft = len(fulltime[fulltime['一级组织'] == '中小微事业群'])
zxw_jc = len(join_july[join_july['一级组织'] == '中小微事业群'])
zxw_lc = len(leave_july[leave_july['一级组织'] == '中小微事业群'])
zxw_wjc = len(weekly_join[weekly_join['一级组织'] == '中小微事业群'])
zxw_wlc = len(weekly_leave[weekly_leave['一级组织'] == '中小微事业群'])

update_monthly(data['zxwSubTotal'], '7月', {
    'startCount': zxw_ft,
    'fullTime': zxw_ft,
    'intern': 0,
    'joinCount': zxw_jc,
    'leaveCount': zxw_lc,
    'netChange': zxw_jc - zxw_lc,
    'weeklyJoinCount': zxw_wjc,
    'weeklyLeaveCount': zxw_wlc,
})

# ========== zxwSubDepartments 在职人数 ==========
zxw = fulltime[fulltime['一级组织'] == '中小微事业群']
zxw_regional = zxw[zxw['二级组织'] == '区域团队']

dept_counts = {
    '京津片区': len(zxw_regional[zxw_regional['三级组织'] == '京津片区']),
    '鲁鄂豫片区': len(zxw_regional[zxw_regional['三级组织'] == '鲁鄂豫片区']),
    '粤闽赣片区': len(zxw_regional[zxw_regional['三级组织'] == '粤闽赣片区']),
    '沪浙片区': len(zxw_regional[zxw_regional['三级组织'] == '沪浙片区']),
    '苏皖片区': len(zxw_regional[zxw_regional['三级组织'] == '苏皖片区']),
    '辽蒙片区': len(zxw_regional[zxw_regional['三级组织'] == '辽蒙片区']),
    '直辖分公司': len(zxw[zxw['三级组织'] == '直辖分公司']),
    '全国服务中心': len(zxw[zxw['二级组织'] == '全国服务中心']),
    '大客户部': len(zxw[zxw['二级组织'] == '大客户部']),
    '市场中心': len(zxw[zxw['二级组织'] == '市场中心']),
    '运营中心': len(zxw[zxw['二级组织'] == '运营中心']),
    '总部客成中心': len(zxw[zxw['二级组织'] == '总部客成中心']),
    '小微团队': len(zxw[zxw['二级组织'] == '小微团队']),
}

# 直属区域团队 = 区域团队总计 - 各片区/直辖分公司
regional_total = len(zxw_regional)
piandxia_total = sum(dept_counts[k] for k in ['京津片区', '鲁鄂豫片区', '粤闽赣片区', '沪浙片区', '苏皖片区', '辽蒙片区', '直辖分公司'])
dept_counts['直属区域团队'] = regional_total - piandxia_total

# 直属中小微事业群保持之前的数据
# 从之前的JSON中读取
for dept in data['zxwSubDepartments']:
    if dept['name'] == '直属中小微事业群':
        for item in dept['monthly']:
            if item['month'] == '7月':
                dept_counts['直属中小微事业群'] = item['startCount']
                break
        break

# ========== zxwSubDepartments 入职离职统计 ==========
# 7月入职按三级组织
zxw_join_july = join_july[join_july['一级组织'] == '中小微事业群']
zxw_leave_july = leave_july[leave_july['一级组织'] == '中小微事业群']
zxw_wjoin = weekly_join[weekly_join['一级组织'] == '中小微事业群']
zxw_wleave = weekly_leave[weekly_leave['一级组织'] == '中小微事业群']

# 按三级组织统计
def count_by_org3(df, col='三级组织'):
    result = {}
    for _, row in df.iterrows():
        org3 = row[col]
        if pd.isna(org3):
            org3 = '未知'
        result[org3] = result.get(org3, 0) + 1
    return result

join_by_org3 = count_by_org3(zxw_join_july)
leave_by_org3 = count_by_org3(zxw_leave_july)
wjoin_by_org3 = count_by_org3(zxw_wjoin)
wleave_by_org3 = count_by_org3(zxw_wleave)

# 按二级组织统计
def count_by_org2(df, col='二级组织'):
    result = {}
    for _, row in df.iterrows():
        org2 = row[col]
        if pd.isna(org2):
            org2 = '未知'
        result[org2] = result.get(org2, 0) + 1
    return result

join_by_org2 = count_by_org2(zxw_join_july)
leave_by_org2 = count_by_org2(zxw_leave_july)
wjoin_by_org2 = count_by_org2(zxw_wjoin)
wleave_by_org2 = count_by_org2(zxw_wleave)

# 映射到JSON中的组织名称
org3_to_dept = {
    '京津片区': '京津片区',
    '鲁鄂豫片区': '鲁鄂豫片区',
    '粤闽赣片区': '粤闽赣片区',
    '沪浙片区': '沪浙片区',
    '苏皖片区': '苏皖片区',
    '辽蒙片区': '辽蒙片区',
    '直辖分公司': '直辖分公司',
}

# 更新各子组织
for dept_name, count in dept_counts.items():
    if dept_name == '直属中小微事业群':
        continue

    jc = 0
    lc = 0
    wjc = 0
    wlc = 0

    if dept_name in org3_to_dept:
        org3 = [k for k, v in org3_to_dept.items() if v == dept_name][0]
        jc = join_by_org3.get(org3, 0)
        lc = leave_by_org3.get(org3, 0)
        wjc = wjoin_by_org3.get(org3, 0)
        wlc = wleave_by_org3.get(org3, 0)
    elif dept_name in ['全国服务中心', '大客户部', '市场中心', '运营中心', '总部客成中心', '小微团队', '直属区域团队']:
        jc = join_by_org2.get(dept_name, 0)
        lc = leave_by_org2.get(dept_name, 0)
        wjc = wjoin_by_org2.get(dept_name, 0)
        wlc = wleave_by_org2.get(dept_name, 0)

    update_zxw_dept(dept_name, '7月', {
        'startCount': count,
        'fullTime': count,
        'joinCount': jc,
        'leaveCount': lc,
        'netChange': jc - lc,
        'weeklyJoinCount': wjc,
        'weeklyLeaveCount': wlc,
    })

# 直属中小微事业群保持不变

# 保存
with open('src/data/personnel-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('更新完成！')
print(f'公司总人数: {total_ft + total_intern} (全职{total_ft} + 实习{total_intern})')
print(f'本周入职: {total_wjc}, 本周离职: {total_wlc}')
print(f'7月累计入职: {total_jc}, 7月累计离职: {total_lc}')
