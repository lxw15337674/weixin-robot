// import { beforeEach, describe, expect, it, jest } from "@jest/globals";
// import { CommandParams } from "../command";
// import { repeatMessage } from "../acions/repeatMessage";

// describe('repeatMessage', () => {
//     const mockSendMessage = jest.fn();
//     const baseParams: CommandParams = {
//         args: '',
//         sendMessage: mockSendMessage,
//         key: 're',
//         roomId: undefined
//     };

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('应该返回错误提示当没有参数时', async () => {
//         const result = await repeatMessage(baseParams);
//         expect(result).toBe('请输入要复读的内容和次数，例如: re 你好 3');
//     });

//     it('应该正确复读指定内容', async () => {
//         const params = {
//             ...baseParams,
//             args: '<img class="qqemoji qqemoji70" text="[炸弹]_web" src="/zh_CN/htmledition/v2/images/spacer.gif" /> 3',
//         }
//         const result = await repeatMessage(params);
//         expect(result).toBe('你好\n你好\n你好');
//     });
//     it('应该正确复读指定次数', async () => {
//         const params = { ...baseParams, args: '你好 3' };
//         const result = await repeatMessage(params);
//         expect(result).toBe('你好\n你好\n你好');
//     });

//     it('应该默认复读1次当未指定次数', async () => {
//         const params = { ...baseParams, args: '你好' };
//         const result = await repeatMessage(params);
//         expect(result).toBe('你好');
//     });

//     it('应该处理非法次数参数', async () => {
//         const params = { ...baseParams, args: '你好 abc' };
//         const result = await repeatMessage(params);
//         expect(result).toBe('复读次数必须是数字');
//     });

//     it('应该限制最大复读次数', async () => {
//         const params = { ...baseParams, args: '你好 11' };
//         const result = await repeatMessage(params);
//         expect(result).toBe('复读次数不能超过10次');
//     });

//     it('应该处理负数次数', async () => {
//         const params = { ...baseParams, args: '你好 -1' };
//         const result = await repeatMessage(params);
//         expect(result).toBe('复读次数必须大于0');
//     });
// });