import requests
import time

#ids为课程id，id为当前正在刷的
#ids是一次性的。应该确保每次刷完之后重新从浏览器进入视频，则你的进度就会被保存，ID也会改变
ids = ['65c74e9bfe44cd0001c23d93','65c74eed1523fa00014f1f2f','65c74f0dfe44cd0001c23d94','65c74f287cd13a00017ad7ff','65c74f495a7cc100014d4eb8','65c74f6af599d800018edab3','65c74f8b74160700014c4073','65c74fad1523fa00014f1f30']
id = ids[0]
url = f"https://apiucloud.bupt.edu.cn/ykt-site/site-resource-learn-time-behavior/beat?id={id}&learnTime="
bladeauth = "xxxxxx"
jsonid = "JSxxx:xxxxx"

headers = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36 Edg/121.0.0.0",
    "authority": "apiucloud.bupt.edu.cn",
    "method": "POST",
    "path": f"",
    "scheme": "https",
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "authorization": "Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=",
    "blade-auth": f"{bladeauth}",
    "identity": f"{jsonid}",
    "origin": "https://ucloud.bupt.edu.cn",
    "referer": "https://ucloud.bupt.edu.cn/",
    "sec-ch-ua": '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "tenant-id": "000000",
}

learning_time = 3600000  #开始刷的时间。设置为9000为类似于正常流程，从9秒开始，每10秒发送一次，要让最大学习时间大一点。
#如果想一次性直接刷超长时间，就设置很大的值 最大学习时间小一点，一次就过了
id = ids[0]
index = 0
print("开始学习第1课")
while True:
    url = f"https://apiucloud.bupt.edu.cn/ykt-site/site-resource-learn-time-behavior/beat?id={id}&learnTime="
    headers["path"] = f"/ykt-site/site-resource-learn-time-behavior/beat?id={id}&learnTime=" +str(learning_time)
    response = requests.post(url + str(learning_time), headers=headers)
    print(f"{response.text}，学习时间:{learning_time},即{learning_time / 1000}秒")
    # Increase learning time by 10000 for the next iteration
    learning_time += 10000
    # Wait for 10 seconds before the next iteration
    time.sleep(10)
    if(learning_time >= 1800000): #最大学习时间，超过将切换到下一个。注意若小于开始刷的时间，则只会运行一次
        index+=1
        id = ids[index]
        learning_time = 3600000 #同上，记得恢复初始值
        print(f"开始学习第{index+1}课")
