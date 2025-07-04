"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
describe('Versalog', () => {
    let logSpy;
    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    });
    afterEach(() => {
        logSpy.mockRestore();
    });
    it('simpleモードでinfoログが出力される', () => {
        const logger = new index_1.default('simple');
        logger.info('テストメッセージ');
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[+] テストメッセージ'));
    });
    it('detailedモードでinfoログが出力される', () => {
        const logger = new index_1.default('detailed');
        logger.info('詳細テスト');
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('詳細テスト'));
    });
    it('fileモードでファイル名と行番号が含まれる', () => {
        const logger = new index_1.default('file');
        logger.info('ファイルテスト');
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*:\d+\]\[INFO\]/));
    });
    it('show_file=trueでsimpleモードでもファイル名が含まれる', () => {
        const logger = new index_1.default('simple', true);
        logger.info('ファイル表示テスト');
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*:\d+\]\[\+\]/));
    });
    it('err, warメソッドも正しく動作する', () => {
        const logger = new index_1.default('simple');
        logger.err('エラーメッセージ');
        logger.war('警告メッセージ');
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[-] エラーメッセージ'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[!] 警告メッセージ'));
    });
});
