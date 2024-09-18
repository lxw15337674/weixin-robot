module.exports = {
    apps: [
        {
            name: "weixin-robot",
            script: "npm",
            args: "run dev", // 或者 "run start"
            "restart_delay": 1000  // 重启延迟，单位毫秒
        },
    ],
};
