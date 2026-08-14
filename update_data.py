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

# 8月累计
join_aug = join_df[(join_df['入职日期'] >= '2026-08-01') & (join_df['入职日期'] <= '2026-08-31')]
leave_aug = leave_df[(leave_df['离职日期'] >= '2026-08-01') & (leave_df['离职日期'] <= '2026-08-31')]

# 本周 8/10-8/14
start_week = pd.Timestamp('2026-08-10')
end_week = pd.Timestamp('2026-08-14')
weekly_join = join_df[(join_df['入职日期'] >= start_week) & (join_df['入职日期'] <= end_week)]
weekly_leave = leave_df[(leave_df['离职日期'] >= start_week) & (leave_df['离职日期'] <= end_week)]

# ========== 更新 updateDate ==========
data['updateDate'] = '2026年8月14日'

# ========== 辅助函数 ==========
def add_or_update_monthly(org_list, month, updates):
    for item in org_list:
        if item['month'] == month:
            item.update(updates)
            return
    # 没有找到，添加新条目
    new_entry = {'month': month}
    new_entry.update(updates)
    org_list.append(new_entry)

def update_org_monthly(org_name, month, updates):
    for org in data['organizations']:
        if org['name'] == org_name:
            add_or_update_monthly(org['monthly'], month, updates)
            return

def update_zxw_dept(dept_name, month, updates):
    for dept in data['zxwSubDepartments']:
        if dept['name'] == dept_name:
            add_or_update_monthly(dept['monthly'], month, updates)
            return

# ========== Company Total (不含SJS) ==========
total_ft = len(fulltime[fulltime['一级组织'] != '十角兽'])
total_intern = len(df[(df['一级组织'] != '十角兽') & (df['用工类型'] == '实习')])
total_jc = len(join_aug[join_aug['一级组织'] != '十角兽'])
total_lc = len(leave_aug[leave_aug['一级组织'] != '十角兽'])
total_wjc = len(weekly_join[weekly_join['一级组织'] != '十角兽'])
total_wlc = len(weekly_leave[weekly_leave['一级组织'] != '十角兽'])

add_or_update_monthly(data['companyTotal'], '8月', {
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
    jc = len(join_aug[join_aug['一级组织'] == org_name])
    lc = len(leave_aug[leave_aug['一级组织'] == org_name])
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
sjs_jc = len(join_aug[join_aug['一级组织'] == '十角兽'])
sjs_lc = len(leave_aug[leave_aug['一级组织'] == '十角兽'])
sjs_wjc = len(weekly_join[weekly_join['一级组织'] == '十角兽'])
sjs_wlc = len(weekly_leave[weekly_leave['一级组织'] == '十角兽'])
org_stats['十角兽'] = {
    'startCount': sjs_ft + sjs_intern,
    'fullTime': sjs_ft,
    'intern': sjs_intern,
    'joinCount': sjs_jc,
    'leaveCount': sjs_lc,
    'netChange': sjs_jc - sjs_lc,
    'weeklyJoinCount': sjs_wjc,
    'weeklyLeaveCount': sjs_wlc,
}

for org_name, stats in org_stats.items():
    update_org_monthly(org_name, '8月', stats)

# ========== zxwSubTotal ==========
zxw_ft = len(fulltime[fulltime['一级组织'] == '中小微事业群'])
zxw_jc = len(join_aug[join_aug['一级组织'] == '中小微事业群'])
zxw_lc = len(leave_aug[leave_aug['一级组织'] == '中小微事业群'])
zxw_wjc = len(weekly_join[weekly_join['一级组织'] == '中小微事业群'])
zxw_wlc = len(weekly_leave[weekly_leave['一级组织'] == '中小微事业群'])

# 更新 analysisNotes - 8月不追加备注

add_or_update_monthly(data['zxwSubTotal'], '8月', {
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
for dept in data['zxwSubDepartments']:
    if dept['name'] == '直属中小微事业群':
        for item in dept['monthly']:
            if item['month'] == '7月':
                dept_counts['直属中小微事业群'] = item['startCount']
                break
        break

# ========== zxwSubDepartments 入职离职统计 ==========
zxw_join_aug = join_aug[join_aug['一级组织'] == '中小微事业群']
zxw_leave_aug = leave_aug[leave_aug['一级组织'] == '中小微事业群']
zxw_wjoin = weekly_join[weekly_join['一级组织'] == '中小微事业群']
zxw_wleave = weekly_leave[weekly_leave['一级组织'] == '中小微事业群']

def count_by_org3(df, col='三级组织'):
    result = {}
    for _, row in df.iterrows():
        org3 = row[col]
        if pd.isna(org3):
            org3 = '未知'
        result[org3] = result.get(org3, 0) + 1
    return result

join_by_org3 = count_by_org3(zxw_join_aug)
leave_by_org3 = count_by_org3(zxw_leave_aug)
wjoin_by_org3 = count_by_org3(zxw_wjoin)
wleave_by_org3 = count_by_org3(zxw_wleave)

def count_by_org2(df, col='二级组织'):
    result = {}
    for _, row in df.iterrows():
        org2 = row[col]
        if pd.isna(org2):
            org2 = '未知'
        result[org2] = result.get(org2, 0) + 1
    return result

join_by_org2 = count_by_org2(zxw_join_aug)
leave_by_org2 = count_by_org2(zxw_leave_aug)
wjoin_by_org2 = count_by_org2(zxw_wjoin)
wleave_by_org2 = count_by_org2(zxw_wleave)

org3_to_dept = {
    '京津片区': '京津片区',
    '鲁鄂豫片区': '鲁鄂豫片区',
    '粤闽赣片区': '粤闽赣片区',
    '沪浙片区': '沪浙片区',
    '苏皖片区': '苏皖片区',
    '辽蒙片区': '辽蒙片区',
    '直辖分公司': '直辖分公司',
}

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

    update_zxw_dept(dept_name, '8月', {
        'startCount': count,
        'fullTime': count,
        'intern': 0,
        'joinCount': jc,
        'leaveCount': lc,
        'netChange': jc - lc,
        'weeklyJoinCount': wjc,
        'weeklyLeaveCount': wlc,
    })

# ========== 更新 zxwSubDepartments children (分公司/办事处) 数据 ==========
def count_by_org4(df, col='四级组织'):
    result = {}
    for _, row in df.iterrows():
        org4 = row[col]
        if pd.isna(org4):
            org4 = '未知'
        result[org4] = result.get(org4, 0) + 1
    return result

join_by_org4 = count_by_org4(zxw_join_aug)
leave_by_org4 = count_by_org4(zxw_leave_aug)
wjoin_by_org4 = count_by_org4(zxw_wjoin)
wleave_by_org4 = count_by_org4(zxw_wleave)

for dept in data['zxwSubDepartments']:
    if 'children' not in dept:
        continue
    for child in dept['children']:
        if '直属' in child['name']:
            continue
        child_name = child['name']
        jc = join_by_org4.get(child_name, 0)
        lc = leave_by_org4.get(child_name, 0)
        wjc = wjoin_by_org4.get(child_name, 0)
        wlc = wleave_by_org4.get(child_name, 0)
        # 统计在职人数
        child_df = zxw[zxw['四级组织'] == child_name]
        child_ft = len(child_df)
        child_intern = 0
        add_or_update_monthly(child['monthly'], '8月', {
            'startCount': child_ft + child_intern,
            'fullTime': child_ft,
            'intern': child_intern,
            'joinCount': jc,
            'leaveCount': lc,
            'netChange': jc - lc,
            'weeklyJoinCount': wjc,
            'weeklyLeaveCount': wlc,
        })

# 更新 sjsData
add_or_update_monthly(data['sjsData']['monthly'], '8月', {
    'startCount': sjs_ft + sjs_intern,
    'fullTime': sjs_ft,
    'intern': sjs_intern,
    'joinCount': sjs_jc,
    'leaveCount': sjs_lc,
    'netChange': sjs_jc - sjs_lc,
    'weeklyJoinCount': sjs_wjc,
    'weeklyLeaveCount': sjs_wlc,
})

# ========== 更新 sequence-ratio-data.json ==========
cs_positions = ['客户成功专员', '客户成功主管', '高级客户成功专员', '实施专员', '实施主管']
sales_positions = ['销售专员', '销售主管']
mgmt_positions = ['城市负责人', '客户成功经理', '区域总经理', '助理总裁', '办事处经理', '副总裁', '客户成功总监']

zxw_region_all = fulltime[(fulltime['一级组织'] == '中小微事业群') & (fulltime['二级组织'] == '区域团队')]
cs_count = len(zxw_region_all[zxw_region_all['岗位'].isin(cs_positions)])
sales_count = len(zxw_region_all[zxw_region_all['岗位'].isin(sales_positions)])
mgmt_count = len(zxw_region_all[zxw_region_all['岗位'].isin(mgmt_positions)])
ratio = round((cs_count + sales_count) / mgmt_count, 2) if mgmt_count > 0 else 0

with open('src/data/sequence-ratio-data.json', 'r', encoding='utf-8') as f:
    seq_data = json.load(f)

seq_data['updateDate'] = data['updateDate']
# 追加8月数据(避免重复)
existing_seq_months = {item['month'] for item in seq_data['data']}
if '8月' not in existing_seq_months:
    seq_data['data'].append({
        'month': '8月',
        'customerSuccess': cs_count,
        'sales': sales_count,
        'management': mgmt_count,
        'guanMinRatio': ratio,
    })

with open('src/data/sequence-ratio-data.json', 'w', encoding='utf-8') as f:
    json.dump(seq_data, f, ensure_ascii=False, indent=2)

# ========== 更新 sales-cs-data.json ==========
with open('src/data/sales-cs-data.json', 'r', encoding='utf-8') as f:
    sc_data = json.load(f)

sc_data['updateDate'] = data['updateDate']

zxw_ft_all = fulltime[fulltime['一级组织'] == '中小微事业群']
regional = zxw_ft_all[zxw_ft_all['二级组织'] == '区域团队']
zhixia = zxw_ft_all[zxw_ft_all['三级组织'] == '直辖分公司']

pos_map = {
    '销售专员': 'salesSpecialist',
    '销售主管': 'salesManager',
    '客户成功经理': 'csManager',
    '客户成功主管': 'csSupervisor',
    '客户成功专员': 'csSpecialist',
    '高级客户成功专员': 'csSpecialist',
    '实施主管': 'implementSupervisor',
    '实施专员': 'implementSpecialist',
}

def count_positions(df):
    counts = {v: 0 for v in pos_map.values()}
    for _, row in df.iterrows():
        pos = row['岗位']
        if pos in pos_map:
            counts[pos_map[pos]] += 1
    return counts

national = count_positions(zxw_ft_all[zxw_ft_all['二级组织'].isin(['区域团队']) | (zxw_ft_all['三级组织'] == '直辖分公司')])
national['region'] = '全国'
national['branch'] = '全国'
sc_data['summary'] = national

for region in sc_data['regions']:
    rname = region['regionName']
    if rname == '直辖分公司':
        region_df = zhixia
    else:
        region_df = regional[regional['三级组织'] == rname]
    
    reg_summary = count_positions(region_df)
    reg_summary['region'] = rname
    reg_summary['branch'] = rname
    region['summary'] = reg_summary
    
    for branch in region['branches']:
        bname = branch['branch']
        branch_df = region_df[region_df['四级组织'] == bname]
        counts = count_positions(branch_df)
        branch.update(counts)

with open('src/data/sales-cs-data.json', 'w', encoding='utf-8') as f:
    json.dump(sc_data, f, ensure_ascii=False, indent=2)

# 保存
with open('src/data/personnel-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('更新完成！')
print(f'公司总人数: {total_ft + total_intern} (全职{total_ft} + 实习{total_intern})')
print(f'本周入职: {total_wjc}, 本周离职: {total_wlc}')
print(f'8月累计入职: {total_jc}, 8月累计离职: {total_lc}')