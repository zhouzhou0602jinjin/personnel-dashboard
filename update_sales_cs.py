import json

with open('src/data/sales-cs-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 更新日期
data['updateDate'] = '2026年7月19日'

# 更新 summary
data['summary']['salesSpecialist'] = 66
data['summary']['csSpecialist'] = 104

# 更新各 regions
for region in data['regions']:
    name = region['regionName']
    if name == '京津片区':
        region['summary']['salesSpecialist'] = 3
        for b in region['branches']:
            if b['branch'] == '北京':
                b['salesSpecialist'] = 2
    elif name == '沪浙片区':
        region['summary']['salesSpecialist'] = 10
        for b in region['branches']:
            if b['branch'] == '上海':
                b['salesSpecialist'] = 6
            elif b['branch'] == '杭州':
                b['salesSpecialist'] = 4
    elif name == '苏皖片区':
        region['summary']['salesSpecialist'] = 14
        region['summary']['csSpecialist'] = 14
        for b in region['branches']:
            if b['branch'] == '南京':
                b['salesSpecialist'] = 8
                b['csSpecialist'] = 7
            elif b['branch'] == '苏州':
                b['salesSpecialist'] = 4

# 保存
with open('src/data/sales-cs-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('sales-cs-data.json 更新完成')
print('summary:', data['summary'])
