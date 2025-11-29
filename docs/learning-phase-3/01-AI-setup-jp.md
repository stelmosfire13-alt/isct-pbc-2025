# セットアップ

## Claudeについて

Claudeは、Anthropic社が開発した高度な大規模言語モデル（LLM）です。Anthropicは2021年に元OpenAIの研究者やエンジニアによって設立された、米国サンフランシスコ拠点のAI安全性・研究企業です。

Claudeは人間のような自然なテキストの理解・生成、質問応答、要約、創作支援などを得意としています。特に安全性や倫理的な利用、役立つ応答の提供に重点を置いて設計されています。Claudeという名前は情報理論の先駆者クロード・シャノンに由来します。

Anthropicは責任あるAI開発と透明性を重視し、AI研究を進めています。詳細は https://www.anthropic.com/ をご覧ください。

## Claude Codeについて

Claude Codeとは、Anthropicが開発した大規模言語モデルClaudeを活用したAIプログラミングやAIエージェントのコードを指します。

### Claudeの特徴
- 高度な自然言語理解と生成能力
- 長文や複雑な文脈の処理が得意
- 安全性や倫理性を重視した設計

### Claude Codeの主な用途
- チャットボットやAIアシスタントの開発
- テキスト要約、翻訳、質問応答システム
- コード生成やレビュー、ドキュメント作成の自動化

### Claude Codeの使いやすさ・おすすめ理由

Claude Codeは、開発者にとって使いやすく、APIやSDKが充実しているため、主要なプログラミング言語で簡単に統合できます。自然言語で直感的にモデルとやり取りできるため、複雑なエンジニアリングやプロンプト設計の手間が大幅に軽減されます。

#### Claude Codeを使うべき理由
- **非エンジニアでも使いやすい:** Claude Codeは、プログラミング知識があまりない方でも直感的にAIアプリケーションを作成できるよう設計されています。自然言語インターフェースとシンプルなAPIにより、専門知識がなくても強力なソリューションを構築できます。
- **高品質な出力:** 複雑な質問や文脈にも正確かつ一貫性のある応答を返します。
- **長文コンテキスト対応:** 長いドキュメントや会話も処理・生成が可能です。
- **安全性・信頼性:** Anthropicは安全性や倫理性を重視し、有害な出力やバイアスを最小限に抑えています。
- **柔軟な統合性:** チャットボットや自動化ツールなど、さまざまなプロダクトに簡単に組み込めます。
- **継続的なアップデート:** Anthropicは定期的に新機能や改善を提供し、常に最新のAI技術を利用できます。

そのため、Claude Codeは開発者や企業だけでなく、プログラミング未経験の方にもおすすめできる、堅牢で安全かつ高性能なAIソリューションです。

## Claudeのはじめかた
### アカウント作成とAPIキー取得
1. 講師に自分のメールアドレスを連絡します。
2. 届いたメールの「Accept invitation」をクリックします。
![](images/1.png)
3. 認証とオンボーディングで必要事項を入力します。
![](images/2.png)
4. オンボーディングが終わりダッシュボードが表示されたら「Get API Key」をクリックします。
![](images/3.png)
5. 「CreateKey」ボタンをクリックします。
![](images/4.png)
6. APIキー作成画面が表示されたら、
- 「Workspace」ドロップダウンから「Learning Phase#3」を選択
- 「Name your key」欄に任意の名前を入力（例: pbc-phase3-Key）
- 「Add」ボタンをクリック
![](images/5.png)
7. APIキーを保存します。
![](images/6.png)
8. このような画面が表示されればセットアップ完了です。
![](images/7.png)

### VS CodeでClaude Codeを使う
1. VS Codeを開きます。
2. 左サイドバーの拡張機能アイコンをクリックします。
![](images/8.png)
3. 拡張機能マーケットプレイスで「Claude」と検索します。
![](images/9.png)
4. Anthropicの「Claude Code for VS Code」拡張機能を見つけて「Install」をクリックします。
![](images/10.png)
5. 「Trust Publisher & Install」ボタンをクリックします。
![](images/11.png)
6. 「Open Folder」をクリックし、プロジェクト用のフォルダを選択します。
- プロジェクト用のフォルダを作成してください（例: isct2025-learning-phase3）
![](images/12.png)
7. ターミナルを開きます。
![](images/13.png)
![](images/14.png)

### Claude Codeのインストール

#### Macの場合
1. ターミナルで以下のコマンドを入力します:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```
```bash
Setting up Claude Code...

✔ Claude Code successfully installed!

  Version: 2.0.37

  Location: ~/.local/bin/claude

  Next: Run claude --help to get started

⚠ Setup notes:
  • Native installation exists but ~/.local/bin is not in your PATH. Run:

  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc

✅ Installation complete!
```
2. 上記のように`~/.local/bin`がPATHに含まれていない旨のメッセージが表示された場合は、次のコマンドを実行してPATHを追加してください:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

#### Windowsの場合
1. 管理者権限でPowerShellを開きます。
2. 以下のコマンドを入力します:
```powershell
irm https://claude.ai/install.ps1 | iex
```
```powershell
Setting up Claude Code...
✔ Claude Code successfully installed!

  Version: 2.0.37

  Location: C:\Users\<YourUsername>\AppData\Local\Programs\Claude Code
  Next: Run claude --help to get started
⚠ Setup notes:
  • Native installation exists but C:\Users\<YourUsername>\AppData\Local\Programs\Claude Code is not in your PATH. To add it, run: 
  [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\<YourUsername>\AppData\Local\Programs\Claude Code", [EnvironmentVariableTarget]::User)
✅ Installation complete!
```
3. 上記のようにインストールパスがPATHに含まれていない旨のメッセージが表示された場合は、次のコマンドを実行してPATHを追加してください:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\<YourUsername>\AppData\Local\Programs\Claude Code", [EnvironmentVariableTarget]::User)
```

### Claude Codeの設定

1. Claude Codeを開きます。
![](images/15.png)
2. 「Anthropic Console」をクリックします。
![](images/16.png)
- 上記画面が表示されない場合は、次の画面で「/login」と入力してください。
![](images/17.png)
3. ブラウザが開くので認証を行います。
![](images/18.png)
4. 組織への接続を求められたら「Authorize」をクリックします。
![](images/19.png)
5. この画面が表示されたらVSCodeに戻ります。
![](images/20.png)
6. 最後にこの画面が表示されればセットアップ完了です。
![](images/17.png)

**ナビゲーション:**
- **次へ:** [Claude Codeを使った実装 →](02-cloude-code.md)
