# 接入文档-API接入说明

### 1.公共参数

| 字段名 | 类型 | 描述 |
| --- | --- | --- |
| app\_key | string | 应用key |
| client\_os\_type | number | 1-IOS端，2- Android端，3-Web端，4-Linux |
| nonce | string | 随机字符串，随机性越大越好，每个请求都需要重新生成 |
| timestamp | number | 当前Unix毫秒数时间戳，每个请求都需要重新生成 |
| device\_id | string | 设备唯一标识 |
| device\_id\_type | string | device\_id设备唯一标识字段类型，主要有以下六种设备标识类型：OAID、OAID\_MD5、Android\_ID、Android\_ID\_MD5、IDFA、 IDFA\_MD5、UUID |
| version | string | 版本号 |
| sig | string | 签名参数 |

### 2.特殊参数拼接说明

在拼接API请求url时，q、tag\_name参数的值可以包含一些特殊字符如%、+、以及中文字符等，需要对q、tag\_name的参数值做一次URL编码，并且防止某些HTTP客户端（比如Ruby HTTP客户端）对这些参数值做二次编码。

### 3.设备ID生成算法

#### Android

| 设备ID参数 | 优先级排序 | device\_id\_type | 含义 | 备注 |
| --- | --- | --- | --- | --- |
| OAID | 最高 | 固定值"OAID" | Android Q及更高版本的设备号，32位 | 样例：97e7ef3f-e5f2-d0b8-ccfc-f79bbeaf4841，注意： 会存在部分用户未授权导致无法获取oaid的情况，OAID为空则使用Android ID作为兜底设备号 |
| OAID\_MD5 | 最高 | 固定值"OAID\_MD5" | Android Q及更高版本的设备号的md5摘要，32位 | 样例： 87f8274c36eb73fabcbf143a10eca6a4，注意：会存在部分用户未授权导致无法获取oaid的情况， OAID为空则使用Android ID作为兜底设备号 |
| Android ID | 最低 | 固定值"Android\_ID" | Android ID原值，16位 | 样例，androidId的原值是： 7b5ca2d57178d2f1； |
| Android ID\_MD5 | 最低 | 固定值"Android\_ID\_MD5" | Android ID的md5值，32位 | 样例，androidId的原值是： 7b5ca2d57178d2f1，md5摘要结果：873541edf36da9170af47d5b69e82193； |

优先取OAID或OAID的32位MD5摘要值作为设备ID，如果取不到就取Android ID或 Android ID的32位MD5摘要值作为设备ID。合作方需优先回传用户真实的OAID，使用OAID可以关联并打通喜马拉雅主APP中记录的用户画像数据，对后续个性化推荐接口推荐给用户内容的准确性会有极大的提升。

OAID获取代码参考如下：

```java
MdidSdkHelper.InitSdk(this, true, new IIdentifierListener() {
    @Override
    public void OnSupport(boolean b, IdSupplier idSupplier) {
        if (idSupplier != null && idSupplier.isSupported())
        idSupplier.getOAID();
    }
});
```

Android ID获取代码参考如下：

```java
public String getAndroidId() {
  return android.provider.Settings.Secure.getString(
       getAplication().getContentResolver(),
       android.provider.Settings.Secure.ANDROID_ID);
}
```

#### IOS

| 设备ID参数 | 优先级排序 | device\_id\_type | 含义 | 备注 |
| --- | --- | --- | --- | --- |
| IDFA | 最高 | 固定值"IDFA" | IOS 6+的设备id字段，32位 | 样例：4FCFEFA1-096D-4176-B352-1870ED6DB777，注意：一些例外00000000-0000-0000-0000-000000000000如果用户关闭里读取idfa的权限，则使用 UUID作为兜底设备号 |
| IDFA\_MD5 | 最高 | 固定值"IDFA\_MD5" | IDFA的MD5摘要值，32位 | 样例：09c593c62a6074ae5f859e97a222c0e8， 注意：一些例外00000000-0000-0000-0000-000000000000如果用户关闭里读取idfa的权限，则使用 UUID作为兜底设备号 |
| UUID | 最低 | 固定值"UUID" | 随机生成的唯一ID作为设备ID | 样例：19AAB430-9CB8-4325-ACC5-D7D386B68960，注意：生成后需要保存，而非每次重新生成，保证单个设备的唯一性。 |

优先取IDFA作为设备ID，如果取不到就随机生成UUID作为设备ID（注意生成后要存下来，不要每次都重新生成，保证单个设备的唯一性），如果出于用户隐私数据安全考虑，可以对得到的设备ID再进行MD5摘要，注意不要加盐。

idfa获取代码参考如下：

```plaintext
[[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString];
```

#### Linux

使用MAC地址或者其他能唯一标识设备的值作为设备ID。

#### Web

建议在用户第一次访问页面时随机生成UUID作为设备ID，并且存为永久cookie避免每次都重新生成。

### 4.通用签名生成算法

签名生成步骤：

1.  将除了sig以外的所有请求参数的原始值（即不做任何处理的参数值，比如不能进行URL编码）按照参数名的字典序排序

2.  将排序后的参数键值对用&拼接，即拼接成key1=val1&key2=val2&...

3.  将步骤2得到的字符串进行Base64编码（注意Base64编码时要设置字符集为utf8），假设Base64编码后的字符串为base64EncodedStr

4.  使用app\_secret对base64EncodedStr进行HMAC-SHA1哈希得到字节数组（注意是字节数组，不要转成十六进制字符串，否则签名计算会出错；一般的HMAC-SHA1算法得到的结果是字节数组的十六进制表示，请务必留意这里和一般情况不太一样），用伪代码表示即

    ```plaintext
    sha1ResultBytes = hmac-sha1(base64EncodedStr, sha1Key)
    ```

5.  对上面得到的sha1ResultBytes进行MD5得到32位字符串，即为sig


#### 签名 demo

```java
public class EncryptDemo {


    public static void main(String[ ] args) throws Exception {


        String appKey = "xxx";
        String appSecret = "xxx";
        // 排序
        Map<String, Object> map = new TreeMap<>();
        map.put("app_key", appKey);
        map.put("client_os_type", 18);
        map.put("device_id", "ojQnJ5ReAW_Ew2fUYPuNpykoyn98");
        map.put("nonce", "VaPjiYzV");
        map.put("sn", "111030_00_1001030");
        map.put("timestamp", "1692153057866");
        map.put("device_id_type", "UUID");
        map.put("version", "1.0");
        map.put("id", "2c5e0810148547f9951e468b745adea8");
        // 用&拼接
        List<String> list = new ArrayList<>();
        map.forEach((k, v) -> list.add(k + "=" + v));
        String paramStr = String.join("&", list);
        System.out.println("拼接：" + paramStr);
        // Base64编码
        // Android 环境
        //String paramBase64 = android.util.Base64.encodeToString(paramStr.getBytes(), android.util.Base64.NO_WRAP);
        // Java 环境
        String paramBase64 = java.util.Base64.getEncoder().encodeToString(paramStr.getBytes());
        System.out.println("base64：" + paramBase64);
        // HMAC-SHA1
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(appSecret.getBytes(), "HmacSHA1"));


        byte[ ] sha1 = mac.doFinal(paramBase64.getBytes());


        System.out.println("sha1 bytes：" + Arrays.toString(sha1));
        // MD5


        byte[ ] md5 = MessageDigest.getInstance("MD5").digest(sha1);


        System.out.println("md5 bytes：" + Arrays.toString(md5));
        StringBuilder hs = new StringBuilder();
        for (byte b : md5) {
            String s = Integer.toHexString(b & 0XFF);
            if (s.length() == 1) {
                hs.append('0');
            }
            hs.append(s);
        }
        System.out.println("参数：" + paramStr + "&sig=" + hs);
    }
}
```

### 5.错误码

返回 code=0 成功，其它失败。
