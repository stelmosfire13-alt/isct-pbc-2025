# AI機能の実装

**Programming Boot Camp - Learning Phase 4**

続いて、ペット管理アプリに3つのAI機能を追加します。

---

## 実装する機能

1. **品種自動識別** - 画像から品種を判定
2. **ヘルスケアアドバイザー** - AIチャットボット
3. **子供イメージ画像生成** - 2匹のペットから子供の画像を生成

---

## 使用するAI APIの紹介

### Google Gemini API

#### 概要

Google Gemini APIは、Googleが提供する最新の**マルチモーダルAIモデル**です。

> **マルチモーダルAIとは？**
> 「モーダル（modal）」= データの種類・形式を意味します。マルチモーダルAIは、**複数の種類のデータ**（テキスト、画像、動画、音声など）を同時に理解できるAIです。
>
> - **従来のAI**: テキストだけ、または画像だけを処理
> - **マルチモーダルAI**: 画像を見て「この画像について教えて」と質問すると答えられる
>
> 例：画像 + テキスト → 「この犬の品種は何ですか？」→ 「ゴールデンレトリバーです」

Gemini APIは、テキスト、画像、動画など、さまざまな形式のデータを理解し、処理できます。

#### 主な機能

- **画像理解**: 画像の内容を詳細に分析・説明
- **テキスト生成**: 自然で人間らしい文章を生成
- **会話**: 文脈を理解した対話が可能
- **多言語対応**: 日本語を含む100以上の言語に対応

#### 利用可能なモデル

Google Gemini APIには複数のモデルがありますが、本講義では**Gemini 2.5 Flash**を使用します。

##### Gemini 2.5 Flash（本講義で使用・推奨）🏆

**モデル名**: `gemini-2.5-flash`

- ⚡ **最速**: 応答速度が非常に速い（リアルタイム処理に最適）
- 🎯 **高精度**: 最新の改善により、画像認識・テキスト生成の精度が向上
- 💰 **低コスト**: 最も安価で無料枠も充実
- 🖼️ **マルチモーダル**: テキスト、画像、動画、音声すべてに対応
- 📝 **長文対応**: 最大100万トークン（約75万語）

**無料枠**:
- 15 RPM（Requests Per Minute）
- 1,500 RPD（Requests Per Day）
- 実質的に1日100リクエスト以上無料で使える

**なぜ2.5 Flashを選ぶのか？**
- ✅ 学習に最適な性能とコストバランス
- ✅ 品種識別に十分な精度
- ✅ チャットボットに最適な応答速度
- ✅ 無料枠が大きく、練習に最適

##### Gemini 2.5 Pro（参考）

**モデル名**: `gemini-2.5-pro`

- 🧠 **最高性能**: より複雑な推論タスクに対応、思考プロセスを持つモデル
- 📚 **超長文**: 最大100万トークン（200万トークン対応予定）
- 🎓 **高精度**: 数学・科学ベンチマークで最高性能
- 💰 **高コスト**: 無料枠が少ない（月2 RPM程度）

**用途**: 複雑な医療診断や詳細な分析が必要な場合に使用。本講義の内容は2.5 Flashで十分です。

#### 料金

- **無料枠**: 15 RPM（Gemini 2.5 Flash）
- **有料プラン**: 従量課金制（詳細はGoogle AI Studioで確認）

#### 本講義での用途

1. **品種自動識別**: Gemini 2.5 Flashで画像を分析し、品種を判定（犬、猫、鳥、魚など）
2. **ヘルスケアアドバイザー**: Gemini 2.5 Flashでペットの健康に関する質問に回答

---

### Hugging Face Inference API

#### 概要

Hugging Faceは、機械学習モデルの共有プラットフォームです。Inference APIを使うと、公開されている数万のAIモデルを簡単に利用できます。

#### 主な機能

- **画像生成**: テキストから画像を生成（Stable Diffusion、SDXL、FLUX.1 など）
- **テキスト生成**: 大規模言語モデル（Llama、Mistral など）
- **音声認識**: 音声をテキストに変換（Whisper など）
- **物体検出**: 画像内の物体を検出（YOLO など）
- **画像編集**: 背景除去、高解像度化など

#### 利用可能な画像生成モデル

Hugging Face Inference APIでは、複数の画像生成モデルが利用可能です。本講義では**Stable Diffusion XL Base 1.0**を使用します。

##### Stable Diffusion XL Base 1.0（推奨）🏆

**モデル名**: `stabilityai/stable-diffusion-xl-base-1.0`

- 🎨 **高品質**: 1024x1024の高解像度画像生成
- 🎯 **高精度**: プロンプトの理解が向上
- 📝 **詳細な表現**: より複雑なプロンプトに対応
- 🆓 **無料**: Inference APIで無料利用可能

**本講義での採用理由**:
- ✅ ペットの特徴を正確に表現
- ✅ 無料枠で利用可能

##### Stable Diffusion 2.1（代替オプション）

**モデル名**: `stabilityai/stable-diffusion-2-1`

- ⚡ **高速**: Stable Diffusion XL Base 1.0より処理が速い
- 💾 **軽量**: モデルサイズが小さい
- 📐 **512x512**: 標準解像度

**用途**: 高速な生成が必要な場合や、モデル読み込み待ち時間を避けたい場合

##### FLUX.1 Schnell（最新・高性能）

**モデル名**: `black-forest-labs/FLUX.1-schnell`

- ⭐ **最高品質**: 最新の高性能モデル
- 🎯 **超高精度**: 写真のようなリアルな画像
- ⚡ **高速**: schnellは「速い」という意味

**注意**: 無料枠では読み込みに時間がかかる場合があります

#### 料金

##### 無料枠
- **完全無料**: APIキーのみで利用可能
- **制限**:
  - リクエストレート: 約30リクエスト/分
  - モデル読み込み: 初回20-30秒（キャッシュされる）
  - タイムアウト: 60秒

##### Pro プラン（$9/月）
- **高速**: 優先的に処理される
- **常時起動**: モデルが常に読み込まれた状態
- **より多くのリクエスト**: レート制限が緩和
- **専用エンドポイント**: 安定した性能

#### 本講義での用途
- **子供イメージ画像生成**: 2匹のペットの特徴を組み合わせた画像を生成

---

## APIの選定理由

### なぜこれらのAPIを選んだのか？

#### 1. 学習に最適

**Google Gemini API（Gemini 2.5 Flash）**
- ✅ **無料枠が充実** - 1日あたり1,500リクエストまで無料（学習用途に十分）
- ✅ **マルチモーダル** - 画像とテキストの両方を1つのAPIで処理可能
- ✅ **シンプルなAPI** - 初心者でも理解しやすい
- ✅ **高速応答** - リアルタイム処理に最適な速度
- ✅ **日本語対応が優れている** - 日本語での質問・回答が自然

**Hugging Face Inference API**
- ✅ **無料で利用可能** - 学習環境に最適（具体的な制限は非公開だが、1時間数百リクエスト程度）
- ✅ **豊富なモデル** - 数万のモデルから選択可能
- ✅ **コミュニティが活発** - 問題解決の情報が豊富
- ✅ **オープンソース** - 公開された情報からモデルの仕組みなども学ぶことができる

#### 2. 実用性が高い

これらのAPIは実際の開発現場でも広く使われています：

**Google Gemini API**
- 企業向けのAIアシスタント
- コンテンツ生成ツール
- 画像分析サービス

**Hugging Face**
- スタートアップのプロトタイプ開発
- 研究機関でのモデル評価
- AIアプリケーションの開発

### 他の選択肢との比較

#### OpenAI API

**メリット**:
- 非常に高性能
- 豊富なドキュメント

**デメリット**:
- ❌ **無料枠がない** - 即座に課金が必要
- ❌ **コストが高い** - 学習用途では負担大
- ❌ **APIキー取得に電話番号認証が必要**

➡️ 学習環境には不向き

#### Claude API（Anthropic）

**メリット**:
- 高性能な言語モデル
- 長文処理に強い

**デメリット**:
- ❌ **無料枠が限定的**

➡️ 今回の用途には不十分

### まとめ：今回の選定

| 項目 | Google Gemini | Hugging Face |
|------|---------------|--------------|
| 無料枠 | ⭐⭐⭐⭐ 充実 | ⭐⭐⭐⭐⭐ 完全無料 |
| 日本語対応 | ⭐⭐⭐⭐⭐ 優秀 | ⭐⭐⭐ 普通 |
| セットアップ | ⭐⭐⭐⭐⭐ 簡単 | ⭐⭐⭐⭐ 簡単 |
| ドキュメント | ⭐⭐⭐⭐ 充実 | ⭐⭐⭐⭐ 充実 |
| 学習適性 | ⭐⭐⭐⭐⭐ 最適 | ⭐⭐⭐⭐⭐ 最適 |

今回選定したAPIは、**学習目的、無料枠、使いやすさ、実用性のバランスが優れています**。

---

<br>

**それでは、これらのAPIを使ってAI機能を実装していきましょう！まずは各APIのアクセスキーを取得します。**

<br>


## 事前準備：APIキーの取得

### Google Gemini API キーの取得

品種識別とチャットボットで使用します。

1. Google AI Studio にアクセス：https://aistudio.google.com/

2. Googleアカウントでログイン

3. 左サイドバーの「Get API key」をクリック

4. 「Create API key」をクリック

5. 既存のGoogle Cloudプロジェクトを選択、または新規作成

6. API キーが表示されるのでコピーして保存

---

### Hugging Face API キーの取得

画像生成で使用します。

1. Hugging Face にアクセス：https://huggingface.co/

2. 「Sign Up」からアカウント作成（GitHubアカウントでも可）

3. 右上のアイコン → 「Settings」をクリック

4. 左サイドバーの「Access Tokens」をクリック

5. 「Create new token」をクリック
   - **Token type**: `Read` を選択（Fine-grained、Read、Writeの3つから選択）
   - **Token name**: `pet-management-app` と入力

6. 画面をスクロールして、一番下の「Create token」をクリック

7. トークンが表示されるのでコピーして保存

---

### 環境変数への追加

`.env.local`ファイルに以下を追加：

```env
# AI API Keys
GOOGLE_GEMINI_API_KEY=ここにGemini APIキーを貼り付け
HUGGINGFACE_API_KEY=ここにHugging Face APIキーを貼り付け
```

**保存したら、必ず開発サーバーを再起動してください**（環境変数の反映のため）。

---

**準備が整いました！それでは、3つのAI機能を順番に実装していきましょう。**

## 機能1: 品種自動識別

### 概要

ペット登録時に画像をアップロードすると、AIが自動的に品種を判定し、Breedフィールドに自動入力します。犬や猫だけでなく、鳥や魚などすべてのペットカテゴリーに対応していますが、飼っている人の多い犬と猫が最も高精度です。

### 1-1. 必要なパッケージのインストール

```bash
npm install @google/generative-ai
```

### 1-2. APIルートの作成

`app/api/pets/identify/route.ts`を作成：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // ファイルをBase64に変換
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Gemini API呼び出し
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = category === 'Dog'
      ? 'この犬の画像を見て、犬種を特定してください。犬種名のみを日本語で回答してください。複数の可能性がある場合は最も可能性の高いものを1つだけ答えてください。'
      : category === 'Cat'
      ? 'この猫の画像を見て、猫種を特定してください。猫種名のみを日本語で回答してください。複数の可能性がある場合は最も可能性の高いものを1つだけ答えてください。'
      : 'この動物の種類を特定してください。種類名のみを日本語で回答してください。'

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image,
        },
      },
      prompt,
    ])

    const breed = result.response.text().trim()

    return NextResponse.json({ breed })
  } catch (error) {
    console.error('Identify error:', error)
    return NextResponse.json(
      { error: 'Failed to identify breed' },
      { status: 500 }
    )
  }
}
```

### 1-3. フロントエンドの更新

`app/my-pets/new/page.tsx`を更新して、画像アップロード時に自動識別を実行します。

既存の`handleImageUpload`関数を以下のように変更：

```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setUploading(true)

  try {
    // 画像をアップロード
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const uploadResponse = await fetch('/api/pets/upload', {
      method: 'POST',
      headers: {
        'x-user-id': user.id,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image')
    }

    const uploadData = await uploadResponse.json()
    setFormData((prev) => ({ ...prev, imageUrl: uploadData.imageUrl }))

    // カテゴリーが選択されている場合、品種を自動識別
    if (formData.category) {
      setIdentifying(true)

      const identifyFormData = new FormData()
      identifyFormData.append('file', file)
      identifyFormData.append('category', formData.category)

      const identifyResponse = await fetch('/api/pets/identify', {
        method: 'POST',
        body: identifyFormData,
      })

      if (identifyResponse.ok) {
        const identifyData = await identifyResponse.json()
        setFormData((prev) => ({ ...prev, breed: identifyData.breed }))
      }

      setIdentifying(false)
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
  } finally {
    setUploading(false)
  }
}
```

`app/my-pets/new/page.tsx`に以下を追加。

```typescript
const [identifying, setIdentifying] = useState(false)
```

**追加場所:**
```typescript
export default function NewPetPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [identifying, setIdentifying] = useState(false) // ← ここに追加
  const [formData, setFormData] = useState({
    // ...
  })
```

同じく`app/my-pets/new/page.tsx`に以下を追加。
```typescript
{identifying && (
  <p className="text-sm text-blue-600">AIが品種を識別中...</p>
)}
```

**追加場所：**
```typescript
<div className="space-y-2">
  <Label htmlFor="breed">Breed</Label>
  <Input
    id="breed"
    value={formData.breed}
    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
  />
</div>

{/* ↓ ここに追加 */}
{identifying && (
  <p className="text-sm text-blue-600">AIが品種を識別中...</p>
)}

<div className="space-y-2">
  <Label htmlFor="birthday">Birthday</Label>
  {/* ... */}
```

### 1-4. 動作確認

1. ペット登録ページで「Category」を選択（Dog、Cat、Bird、Fishなど）
2. ペットの画像をアップロード
3. 数秒後、「Breed」フィールドに自動的に品種名が入力される

> **ヒント**: 犬や猫以外のペット（鳥、魚など）でも試してみましょう！AIがどの程度認識できるか確認できます。ただし、犬と猫が最も高精度です。

---

### Gitでの進捗管理について

機能を実装していく際は、**各機能が完成したらGitでコミット・プッシュ**することをお勧めします。

**なぜコミット・プッシュが重要？**

1. **進捗の記録**: どこまで実装したか記録できる
2. **バックアップ**: PCが故障してもGitHubにコードが残る
3. **間違えても安全**: 前の状態に戻せる

それでは、機能1の進捗を保存しましょう。

---

### 1-5. Gitでコミット・プッシュ

**VSCodeのSource Control（左サイドバーのアイコン）を使う場合：**

1. 左サイドバーの「Source Control」アイコン（ブランチマーク）をクリック
2. 「Changes」の横の「+」ボタンで全ファイルをステージング
3. メッセージ欄に「Add pet breed identification feature」と入力
4. 「✓ Commit」ボタンをクリック
5. 「Sync Changes」または「Publish Branch」をクリック

**ターミナルを使う場合：**

```bash
git add .
git commit -m "Add pet breed identification feature"
git push
```

**これで機能1の実装が記録されました！**

---

**機能1の実装、お疲れ様でした！次は、ペットの健康相談ができるチャットボットを作りましょう。**

## 機能2: ヘルスケアアドバイザーチャットボット

### 概要

ペット詳細ページにチャットボタンを追加し、ペットの健康に関する質問ができます。

### 2-1. APIルートの作成

`app/api/pets/chat/route.ts`を作成：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { message, petInfo } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Gemini API呼び出し
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const systemPrompt = `あなたはペットの健康アドバイザーです。以下のペット情報を参考に、飼い主からの質問に親切に答えてください。

ペット情報：
- 名前: ${petInfo.name}
- 種類: ${petInfo.category}
- 品種: ${petInfo.breed || '不明'}
- 性別: ${petInfo.gender || '不明'}
- 年齢: ${petInfo.age || '不明'}

注意事項：
- 一般的なアドバイスのみを提供してください
- 緊急性が高い症状の場合は、必ず獣医に相談するよう促してください
- 診断や処方は行わないでください
- 優しく、わかりやすい言葉で説明してください`

    const result = await model.generateContent([
      systemPrompt,
      `質問: ${message}`,
    ])

    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
```

### 2-2. チャットコンポーネントの作成

`components/pets/health-chat.tsx`を作成：

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send, X } from "lucide-react"

interface HealthChatProps {
  petInfo: {
    name: string
    category: string
    breed?: string
    gender?: string
    age?: number
  }
}

export function HealthChat({ petInfo }: HealthChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/pets/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          petInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'エラーが発生しました。もう一度お試しください。' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4">
        <MessageCircle className="mr-2 h-4 w-4" />
        健康相談
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ヘルスケアアドバイザー</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0">
          {messages.length === 0 && (
            <p className="text-sm text-gray-600">
              {petInfo.name}の健康について、何でもお聞きください！
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg break-words ${
                msg.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div className="bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]">
              <p className="text-sm">考え中...</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="質問を入力..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2-3. ペット詳細ページへの追加

`app/my-pets/[id]/page.tsx`を更新します。

**① インポート文の追加**

ファイル上部の既存のインポート文の後（`import { format } from "date-fns"` の次の行）に追加：

```typescript
import { Navbar } from "@/components/layout/navbar"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { HealthChat } from "@/components/pets/health-chat" // ← ここに追加
```

**② HealthChatコンポーネントの追加**

return文の最後の`</div>`の上に追加：

```typescript
return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* ... 既存のCard要素など ... */}
    </div>

    {/* ↓ ここに追加（containerの外、min-h-screenの内側） */}
    <HealthChat
      petInfo={{
        name: pet.name,
        category: pet.category,
        breed: pet.breed,
        gender: pet.gender,
        age: pet.birthday ? calculateAge(pet.birthday) : undefined,
      }}
    />
  </div>
)
```

### 2-4. 動作確認

1. ペット詳細ページにアクセス
2. 右下に「健康相談」ボタンが表示される
3. クリックしてチャットウィンドウを開く
4. 質問を入力（例：「散歩の頻度はどのくらいがいいですか？」）
5. AIが回答を返す

### 2-5. Gitでコミット・プッシュ

機能が正常に動作したら、進捗を保存しましょう。

**VSCodeのSource Control（左サイドバーのアイコン）を使う場合：**

1. 左サイドバーの「Source Control」アイコン（ブランチマーク）をクリック
2. 「Changes」の横の「+」ボタンで全ファイルをステージング
3. メッセージ欄に「Add healthcare advisor chatbot feature」と入力
4. 「✓ Commit」ボタンをクリック
5. 「Sync Changes」または「Publish Branch」をクリック

**ターミナルを使う場合：**

```bash
git add .
git commit -m "Add healthcare advisor chatbot feature"
git push
```

**これで機能2の実装が記録されました！**

---

**機能2も完成しました！最後は、画像生成AIを使った楽しい機能を実装しましょう。**

## 機能3: 子供イメージ画像生成

### 概要

2匹のペットを選択して、その子供の姿をAIで生成します。

**特徴**:
- 同じ種類のペット（犬×犬、猫×猫など）: 現実的な子供の姿を生成
- **異なる種類のペット（犬×猫など）**: ファンタジーな「ハイブリッド生物」を生成 🦄

> **キメラ（ハイブリッド）生成について**
> このアプリでは、異なる種類のペットを選択すると、AIが想像力を働かせて両方の特徴を持つ架空の生物を生成します。AIの創造性を体験してみてください！

### 3-1. APIルートの作成

`app/api/pets/generate-child/route.ts`を作成：

この機能では、**2つのAIを組み合わせて**より正確な子供のイメージ画像を生成します：
1. **Gemini API**: 両親の画像から視覚的特徴を分析
2. **Stable Diffusion XL**: 分析結果を元に子供の画像を生成

さらに、両親のカテゴリーが異なる場合（犬×猫など）は、両方の特徴を持つハイブリッド生物として生成します。

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const hfApiKey = process.env.HUGGINGFACE_API_KEY
    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!hfApiKey || !geminiApiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { parent1, parent2 } = await request.json()

    if (!parent1 || !parent2) {
      return NextResponse.json(
        { error: 'Two parents are required' },
        { status: 400 }
      )
    }

    // カテゴリーが同じかチェック
    const sameCategory = parent1.category === parent2.category

    // Gemini APIで両親の画像から特徴を抽出
    let prompt = sameCategory
      ? `A cute baby ${parent1.category.toLowerCase()}`
      : `A creature that is a mix of a ${parent1.category.toLowerCase()} and a ${parent2.category.toLowerCase()}`

    // 両親に画像がある場合、Geminiで特徴を分析
    if (parent1.imageUrl && parent2.imageUrl) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // 画像をfetch
        const [img1Response, img2Response] = await Promise.all([
          fetch(parent1.imageUrl),
          fetch(parent2.imageUrl),
        ])

        const [img1Buffer, img2Buffer] = await Promise.all([
          img1Response.arrayBuffer(),
          img2Response.arrayBuffer(),
        ])

        const img1Base64 = Buffer.from(img1Buffer).toString('base64')
        const img2Base64 = Buffer.from(img2Buffer).toString('base64')

        // Geminiで両親の特徴を分析
        const analysisPrompt = `これら2匹のペットの画像を見て、それぞれの視覚的特徴（毛色、模様、目の色、体格など）を簡潔に英語で説明してください。

1枚目: ${parent1.name} (${parent1.breed || parent1.category})
2枚目: ${parent2.name} (${parent2.breed || parent2.category})

以下の形式で回答してください：
Parent 1: [毛色], [模様の特徴], [その他の特徴]
Parent 2: [毛色], [模様の特徴], [その他の特徴]
Child (mix): [2匹の特徴を組み合わせた子供の想像される見た目]`

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: img1Base64,
            },
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: img2Base64,
            },
          },
          analysisPrompt,
        ])

        const analysis = result.response.text()
        console.log('Gemini analysis:', analysis)

        // 分析結果からChild部分を抽出
        const childMatch = analysis.match(/Child.*?:(.*?)(?:\n|$)/i)
        if (childMatch) {
          const childDescription = childMatch[1].trim()
          // 品種情報を追加
          const breed1 = parent1.breed || parent1.category
          const breed2 = parent2.breed || parent2.category
          const breedInfo = `mix of ${breed1} and ${breed2}`

          if (sameCategory) {
            prompt = `A cute baby ${parent1.category.toLowerCase()} (${breedInfo}), ${childDescription}, adorable, fluffy, high quality, professional photo, cute face, detailed fur texture`
          } else {
            prompt = `A creature that is a mix of a ${parent1.category.toLowerCase()} and a ${parent2.category.toLowerCase()} (${breedInfo}), ${childDescription}, adorable, high quality, professional photo, detailed fur texture`
          }
        }
      } catch (error) {
        console.error('Gemini analysis error:', error)
        // エラーの場合はフォールバック
        if (sameCategory) {
          prompt = `A cute baby ${parent1.category.toLowerCase()} that is a mix between a ${parent1.breed || parent1.category} and a ${parent2.breed || parent2.category}, adorable, fluffy, high quality, professional photo`
        } else {
          prompt = `A creature that is a mix of a ${parent1.category.toLowerCase()} and a ${parent2.category.toLowerCase()}, combining features of a ${parent1.breed || parent1.category} and a ${parent2.breed || parent2.category}, adorable, high quality, professional photo`
        }
      }
    } else {
      // 画像がない場合は品種名ベース
      if (sameCategory) {
        prompt = `A cute baby ${parent1.category.toLowerCase()} that is a mix between a ${parent1.breed || parent1.category} and a ${parent2.breed || parent2.category}, adorable, fluffy, high quality, professional photo`
      } else {
        prompt = `A creature that is a mix of a ${parent1.category.toLowerCase()} and a ${parent2.category.toLowerCase()}, combining features of a ${parent1.breed || parent1.category} and a ${parent2.breed || parent2.category}, adorable, high quality, professional photo`
      }
    }

    console.log('Final prompt:', prompt)

    // Hugging Face Inference API呼び出し（SDXL Base 1.0）
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: 'ugly, deformed, low quality, blurry, distorted',
            num_inference_steps: 30,
            width: 1024,
            height: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', response.status, errorText)
      throw new Error(`Failed to generate image: ${response.status} - ${errorText}`)
    }

    // 画像データを取得
    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const imageUrl = `data:image/jpeg;base64,${base64Image}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate child image' },
      { status: 500 }
    )
  }
}
```

**実装のポイント：**

1. **Geminiで画像分析**: 両親の画像をGeminiに送信し、毛色・模様・目の色などの特徴を抽出
2. **動的プロンプト生成**: Geminiの分析結果を使って、具体的な視覚的特徴を含むプロンプトを作成
3. **フォールバック処理**: 画像がない場合やエラー時は品種名ベースのプロンプトを使用
4. **エラーハンドリング**: 詳細なエラーログを出力して問題を特定しやすくする

### 3-2. 画像生成ページの作成

`app/my-pets/generate/page.tsx`を作成：

```typescript
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/layout/navbar"
import { ArrowLeft, Sparkles } from "lucide-react"

interface Pet {
  id: string
  name: string
  category: string
  breed?: string
  imageUrl?: string
}

export default function GenerateChildPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [parent1Id, setParent1Id] = useState<string>('')
  const [parent2Id, setParent2Id] = useState<string>('')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchPets(parsedUser.id)
  }, [router])

  const fetchPets = async (userId: string) => {
    try {
      const response = await fetch('/api/pets', {
        headers: {
          'x-user-id': userId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch pets')
      }

      const data = await response.json()
      setPets(data.pets)
    } catch (error) {
      console.error('Fetch pets error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!parent1Id || !parent2Id) {
      alert('2匹のペットを選択してください')
      return
    }

    if (parent1Id === parent2Id) {
      alert('異なるペットを選択してください')
      return
    }

    const parent1 = pets.find((p) => p.id === parent1Id)
    const parent2 = pets.find((p) => p.id === parent2Id)

    setGenerating(true)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/pets/generate-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parent1, parent2 }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (error) {
      console.error('Generate error:', error)
      alert('画像の生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/my-pets">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ペット一覧に戻る
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              子供のイメージ画像を生成
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600">
              2匹のペットを選択すると、その子供の姿をAIが生成します。
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">親1を選択</label>
                <Select value={parent1Id} onValueChange={setParent1Id}>
                  <SelectTrigger>
                    <SelectValue placeholder="ペットを選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.breed || pet.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">親2を選択</label>
                <Select value={parent2Id} onValueChange={setParent2Id}>
                  <SelectTrigger>
                    <SelectValue placeholder="ペットを選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.breed || pet.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!parent1Id || !parent2Id || generating}
              className="w-full"
            >
              {generating ? '生成中...' : '子供の画像を生成'}
            </Button>

            {generatedImage && (
              <div className="space-y-2">
                <p className="text-sm font-medium">生成された画像:</p>
                <img
                  src={generatedImage}
                  alt="Generated child"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 3-3. ナビゲーションの追加

`app/my-pets/page.tsx`を更新します。

**① インポートの追加**

ファイル上部のインポート文に`Sparkles`を追加（`Plus`の隣）：

```typescript
import { Plus } from "lucide-react"
```
↓
```typescript
import { Plus, Sparkles } from "lucide-react"
```

**② ボタンレイアウトの変更**

ページタイトルとボタンのセクション（72-79行目あたり）を以下のように変更：

**変更前：**
```typescript
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
  <Link href="/my-pets/new">
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add New Pet
    </Button>
  </Link>
</div>
```

**変更後：**
```typescript
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
  <div className="flex gap-2">
    <Link href="/my-pets/generate">
      <Button variant="outline">
        <Sparkles className="mr-2 h-4 w-4" />
        子供を生成
      </Button>
    </Link>
    <Link href="/my-pets/new">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add New Pet
      </Button>
    </Link>
  </div>
</div>
```

**変更内容：**
- 既存の`Link`要素を`<div className="flex gap-2">`で囲む
- その中に新しい「子供を生成」ボタンのリンクを追加
- 2つのボタンが横並びで表示されるようになります

### 3-4. 動作確認

1. ペット一覧ページで「子供を生成」ボタンをクリック
2. 2匹のペットを選択
   - **同じ種類**（犬×犬、猫×猫など）: 現実的な子供の姿
   - **異なる種類**（犬×猫、猫×鳥など）: ファンタジーなハイブリッド生物 🦄
3. 「子供の画像を生成」をクリック
4. 数秒〜数十秒後、生成された画像が表示される

**注意事項**:
- **初回実行**: Stable Diffusion XLモデルの読み込みに20〜30秒かかります
- **2回目以降**: モデルがキャッシュされるため、5〜10秒程度で生成されます
- **タイムアウト**: 稀ですが、60秒以上かかる場合はエラーになります

### 3-5. Gitでコミット・プッシュ

機能が正常に動作したら、進捗を保存しましょう。

**VSCodeのSource Control（左サイドバーのアイコン）を使う場合：**

1. 左サイドバーの「Source Control」アイコン（ブランチマーク）をクリック
2. 「Changes」の横の「+」ボタンで全ファイルをステージング
3. メッセージ欄に「Add child image generation feature」と入力
4. 「✓ Commit」ボタンをクリック
5. 「Sync Changes」または「Publish Branch」をクリック

**ターミナルを使う場合：**

```bash
git add .
git commit -m "Add child image generation feature"
git push
```

**これで機能3の実装が記録されました！**

---

## まとめ

### 実装した機能

1. ✅ 品種自動識別
2. ✅ ヘルスケアアドバイザーチャットボット
3. ✅ 子供イメージ画像生成

### 使用したAPI

- **Google Gemini API（Gemini 2.5 Flash）**: 画像認識、テキスト生成
  - 品種自動識別
  - ヘルスケアチャットボット
  - 子供画像生成時の両親の特徴抽出
- **Hugging Face Inference API（Stable Diffusion XL Base 1.0）**: 画像生成
  - 子供イメージ画像生成

### 学んだこと

- AI APIの組み込み方法
- 画像データの識別
- チャットボットの実装
- 画像生成AIの活用

---

**3つのAI機能の実装、お疲れ様でした！🎉**

ここまでで基本的なAI統合の流れを体験しました。次のセクションでは、さらに多くの無料AIサービスを紹介します。自由演習の時間に、興味のある機能を追加してみましょう。

## 他に試せる無料AI API

ここまでGoogle GeminiとHugging Face APIを使用してきましたが、**これらでは実現できない新しい機能**を追加できるAI APIを紹介します。
自由演習の時間に、興味のあるAPIを試してみましょう。

---

### 1. AssemblyAI

**提供元**: AssemblyAI
**公式サイト**: https://www.assemblyai.com/

#### Gemini/Hugging Faceとの違い
- **Gemini**: 音声入力は可能（Live API）だが、文字起こし専門機能はない
- **Hugging Face**: 音声認識モデルはあるが、精度とセットアップが難しい
- **AssemblyAI**: 音声認識が高精度 + 簡単 + 日本語対応

#### できること
- **音声認識**: 高精度な音声のテキスト化（音声 → テキスト）
- **話者識別**: 誰が話しているかを識別
- **要約**: 音声内容の自動要約
- **感情分析**: 音声から感情を分析

#### 無料枠
- 毎月100時間の無料文字起こし
- すべての機能が無料枠で利用可能
- **メリット**: クレジットカード登録不要（メールアドレスのみ）

#### 参考リンク
- [AssemblyAI ドキュメント](https://www.assemblyai.com/docs)
- [料金](https://www.assemblyai.com/pricing)

---

### 2. ElevenLabs

**提供元**: ElevenLabs
**公式サイト**: https://elevenlabs.io/

#### Gemini/Hugging Faceとの違い
- **Gemini**: Text-to-Speech機能あり（preview版）だが、ElevenLabsほど自然ではない
- **Hugging Face**: 音声生成モデルはあるが、品質が低く不自然
- **ElevenLabs**: 非常に自然な人間らしい音声で音声生成が可能

#### できること
- **自然な音声生成**: テキストから人間のような音声を生成（テキスト → 音声）
- **多言語対応**: 29言語に対応（日本語もサポート）
- **音声クローン**: 自分の声を複製（有料プラン）
- **感情表現**: 声のトーンや感情を調整

#### 無料枠
- 毎月10,000文字分の音声生成
- 3つのカスタム音声まで作成可能
- **メリット**: クレジットカード登録不要（メールアドレスのみ）

#### 参考リンク
- [ElevenLabs ドキュメント](https://elevenlabs.io/docs)
- [料金](https://elevenlabs.io/pricing)

---

### 3. Replicate

**提供元**: Replicate
**公式サイト**: https://replicate.com/

#### Gemini/Hugging Faceとの違い
- **Gemini**: 動画生成、背景削除、高解像度化の機能なし
- **Hugging Face**: これらのモデルはあるが、セットアップが複雑
- **Replicate**: 簡単なAPI呼び出しで様々な高度なモデルを利用可能

#### できること
- **動画生成**: テキストから動画を生成
- **背景削除**: 画像から背景を自動削除
- **高解像度化**: 古い画像を高画質に変換
- **スタイル変換**: 写真をイラスト風に変換
- **その他多数**: 1000以上のAIモデルにアクセス可能

#### 無料枠
- 毎月少額の無料クレジット
- 従量課金制（モデルごとに料金が異なる）
- **注意**: クレジットカード登録が必要

#### 参考リンク
- [Replicate モデル一覧](https://replicate.com/explore)
- [料金](https://replicate.com/pricing)

---

### 📊 まとめ：各APIの特徴

| API | 機能 | 無料枠 | クレカ |
|-----|------|--------|--------|
| **AssemblyAI** | 音声 → テキスト | 月100時間 | 不要 |
| **ElevenLabs** | テキスト → 音声 | 月10,000文字 | 不要 |
| **Replicate** | 動画生成、背景削除など | 少額 | 必要 |

---

### 実装のヒント

新しいAPIを試す際の基本的な流れ：

1. **APIキー取得**: 各サービスで登録してAPIキーを取得
2. **環境変数設定**: `.env.local`にAPIキーを追加
   ```bash
   ASSEMBLYAI_API_KEY=your_key_here
   ELEVENLABS_API_KEY=your_key_here
   REPLICATE_API_TOKEN=your_key_here
   ```
3. **APIルート作成**: `/app/api/新機能/route.ts`を作成
4. **フロントエンド実装**: 既存のページに機能を追加
5. **テスト**: 動作確認と改善

---

## 自由演習

自由にAI機能を追加してみましょう。
ペット管理ではない新しいAIアプリを開発してもOKです。

最後に何人かに発表していただきます。

---
