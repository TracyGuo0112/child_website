# 接入文档-儿童内容搜索API

### 接入说明

> 接入方式：儿童内容搜索支持 API 或 MCP 两种方式。API 方式参见本文；MCP 方式参见 [《AI 搜索：MCP 使用文档》](https://s.apifox.cn/ae0a322b-d69d-4691-bce4-28a69ca1ac5a)，访问密码：`2wXyXnom`。

> 公共参数和签名算法以及app\_key和secret与之前对接开放平台接口一致 正式url前缀：http://api.ximalaya.com 测试url前缀： 通用接入说明（公共参数/签名算法/设备ID生成）：[《接入文档-API接入说明》](https://alidocs.dingtalk.com/i/nodes/gvNG4YZ7JneMEjBdhA9elRbnV2LD0oRE?utm_scene=team_space)

> 在线接口文档（Apifox）：https://s.apifox.cn/33885c3f-fe85-464a-ac54-0c1642bee2bf

### 儿童内容搜索

#### 功能说明

通过关键词搜索儿童垂类内容，召回源为 AI 召回（NLRS），儿童场景专用。接口入参仅关键词原文，原样透传不做分词，返回专辑与声音归一的结果列表。

#### 请求类型

GET

#### 请求地址

/ximalayaos-openapi-xm/xxm/search/v2/search\_content

#### 请求参数

> tip：此处只描述该接口业务请求参数，通用请求参数见接入说明

| 属性 | 是否必填 | 描述 |
| --- | --- | --- |
| text | 是 | 搜索关键词原文，原样透传不做分词，需 URL 编码 |

**请求示例**

```bash
curl --location --request GET 'http://api.ximalaya.com/ximalayaos-openapi-xm/xxm/search/v2/search_content?app_key=abaa114d7fce4d6ba0a93e1240a96c14&client_os_type=4&device_id=12121231234323&device_id_type=UUID&hub_source=2&nonce=lGn7CcctT9&product_type=smart_watches&text=%E6%88%91%E8%A6%81%E5%90%AC%E8%B4%9D%E4%B9%90%E8%99%8E%E5%84%BF%E6%AD%8C%E7%AC%AC5%E9%9B%86&timestamp=1788867620000&uid=147638429&version=215&version_code=215&sig=2509dd440a037c9849ae17ab2d6b540a'
```

#### 响应参数

成功

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| album\_list | List&lt;XxmSearchV2Item&gt; | 搜索结果列表，专辑与声音归一返回，无分页 |
| album\_id | Long | 专辑 ID（结果项字段） |
| album\_title | String | 专辑标题（结果项字段） |
| track\_id | Long | 声音 ID；专辑类型项无默认声音时为 0（结果项字段） |
| track\_title | String | 声音标题；专辑类型项无默认声音时为空串（结果项字段） |
| play\_count | Long | 播放量（结果项字段） |
| resource\_type | String | 资源类型：album（专辑）/ track（声音）（结果项字段） |
| quality\_score | Double | 质量分，可能为 null（结果项字段） |

**成功响应示例**

```json
{
    "code": 0,
    "ret": 0,
    "msg": "success",
    "data": {
        "album_list": [
            {
                "album_id": 16818055,
                "album_title": "贝乐虎儿歌",
                "track_id": 105274646,
                "track_title": "洋娃娃和小熊跳舞",
                "play_count": 145943636,
                "resource_type": "album",
                "quality_score": 9.2266
            },
            {
                "album_id": 75077245,
                "album_title": "贝乐虎儿歌精选 | 经典儿歌大全",
                "track_id": 772719043,
                "track_title": "幸福拍手歌",
                "play_count": 6645787,
                "resource_type": "album",
                "quality_score": 8.1567
            },
            {
                "album_id": 85295007,
                "album_title": "贝乐虎儿歌｜开心贝乐虎合集｜经典必听",
                "track_id": 796514041,
                "track_title": "哎呀哎呀 我饿了",
                "play_count": 564840,
                "resource_type": "album",
                "quality_score": 6.973
            },
            {
                "album_id": 19394276,
                "album_title": "宝妈贝乐虎儿歌",
                "track_id": 138622011,
                "track_title": "宝妈005 大风车",
                "play_count": 8356635,
                "resource_type": "album",
                "quality_score": 6.2464
            },
            {
                "album_id": 68953734,
                "album_title": "贝乐虎儿歌",
                "track_id": 545771479,
                "track_title": "说谎真难受",
                "play_count": 102577,
                "resource_type": "album",
                "quality_score": 4.6005
            },
            {
                "album_id": 73469717,
                "album_title": "贝乐虎儿歌之超级汽车第二季",
                "track_id": 600024903,
                "track_title": "寻找蛋宝宝",
                "play_count": 41485,
                "resource_type": "album",
                "quality_score": 3.8423
            },
            {
                "album_id": 96645785,
                "album_title": "贝乐虎儿歌",
                "track_id": 885239350,
                "track_title": "捉迷藏（贝乐虎儿歌）",
                "play_count": 579,
                "resource_type": "album",
                "quality_score": 2.7119
            }
        ]
    }
}
```

失败

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| code | int | 错误码，非 0 表示失败 |
| msg | string | 错误信息 |

> AI 召回服务失败/超时时柔性降级，返回 code=0 且 album\_list 为空数组，不报错；app\_key 未配置 os 参数时返回错误信息「未配置os参数」。结果列表顺序即召回质量排序（按 quality\_score 从高到低），原样透传不做重排。
