## [The English version of the README is here.](README_EN.md)
# Beat Saber Overlay 改良版

これは、Reselim氏が製作した[Beat Saber Overlay](https://github.com/Reselim/beat-saber-overlay)に各種表示オプションを追加し、機能改善した物です。

Beat SaberをOBS等で配信や録画する時に譜面情報をオーバーレイ表示します。

![preview](https://rynan4818.github.io/beatsaber-overlay-bsr-image.png)

※画像はHttpStatusExtentionを使用したフルオプションのサンプルです。

## インストール方法 (OBS)

1. Beat Saberからオーバーレイにデータを送信するために下記のmodをインストールしてください。
	- [Beat Saber HTTP Status](https://github.com/opl-/beatsaber-http-status)　※ModAssistant登録の本家版

      ※ModAssistantにある場合は、そちらからインストールした方が間違いありません。

	ほかに、デンバ時計さん製作のパフォーマンス改善版があります。
	- [Beat Saber HTTP Status](https://github.com/denpadokei/beatsaber-http-status)

	オプションの `pp` 機能やカスタム難易度表示を使用するには、デンバ時計さん版のHTTP StatusとHttpStatusExtentionも導入する必要があります。
	- [HttpStatusExtention](https://github.com/denpadokei/HttpStatusExtention)

   ※ModAssistantを使用せずにインストールする場合は、依存modが自動インストールされないので、各modの説明に従ってインストールして下さい

   ※どちらのHTTP StatusもModAssistantにある**websocket-sharpのインストールが必須**です。入れ忘れる事が多いので注意して下さい。

2. [リリースページ](https://github.com/rynan4818/beat-saber-overlay/releases)から最新のリリースをダウンロードします。

3. ダウンロードしたzipファイルを適当なフォルダに解凍します。(例: C:\TOOL\beat-saber-overlay)

4. OBSのソースにブラウザを追加します。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting1.png)

5. 新規作成を選択して、適当にソースの名前を設定して、OKを押します。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting2.png)

6. 解凍したzipファイルの中にある、index.html をダブルクリックするか、ChromeやEdgeブラウザで開きます。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting3.png)

7. ブラウザのアドレス(URL)欄を選択してコピーします。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting4.png)

8. コピーしたアドレスを、OBSのURL欄に貼り付けます。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting5.png)

   ※`ローカルファイル`だと、オプション設定が出来ないのでこの様にURL表記で入力する必要があります。
  
   ※画面サイズに合わせてサイズを設定します。(1280x720等)
  
   ※(オプション) 1080p(1920x1080)の画面サイズの場合、オーバレイ表示を1.5倍に拡大する `scale` 修飾子を使用して下さい。

         file:///C:/TOOL/beat-saber-overlay/index.html?modifiers=scale

9. 必要に応じて URLのindex.htmlの後に `?modifiers=` を追加してオプションを設定します。複数のオプションはカンマ(,)で区切ります。

   ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting6.png)

10. プロパティの幅は意図的に縮めることで、オーバーレイの表示幅を絞ることが可能です。

    曲名、アーティスト・作譜者、難易度(カスタム難易度）が幅を超える場合に自動でスクロールします。

    ![image](https://rynan4818.github.io/beatsaber-overlay-obs-setting7.png)

    ![image](https://rynan4818.github.io/beatsaber-overlay-scllol.gif)

## オプション

次の様なオプションがURLに設定可能です。

```
file:///C:/TOOL/beat-saber-overlay/index.html?modifiers=top,all
```

### `modifiers`

複数のオプションは,(カンマ)で区切ることができます。

- `top`
	* オーバーレイの表示を上部に配置し、レイアウトを垂直方向に反転します。
- `rtl`
	* オーバーレイを右に移動し、右揃えのレイアウトにします。
- `scale`
	* 1080p(1920x1080)の画面で使用するために、オーバーレイを1.5倍にスケーリングします。
- `test`
	* テストのために背景を黒にします。
- `bsr`
	* bsrの検索・表示をします。
- `miss`
	* ミス数を表示します。
- `mod`
	* Modifierを表示します。(DA,FS等)
- `energy`
	* ライフ値バーを表示します
- `pp`
	* ランク譜面の時に精度100%のpp値、Star Difficulty、リアルタイムのpp値を表示します。（※１）
- `all`
	* `bsr`, `miss`, `mod`, `energy`, `pp` オプションを全て表示します。（※１）
- `no-performance`
	* スコア表示を消します。
- `no-hidden`
	* 終了時に表示を消しません。

※１：`pp` オプションを表示するには、[HttpStatusExtention](https://github.com/denpadokei/HttpStatusExtention)の導入が必要です。

### `ip`または`port`

ゲームとOBSが別のPCの場合に、ゲーム用PCのBeat Saber HTTP Statusに接続する場合に設定します。

オプションは省略すると、ip=localhost 及び port=6557 となります。
```
file:///C:/TOOL/beat-saber-overlay/index.html?ip=192.168.1.10&port=6557&modifiers=top,bsr
```

## BSDP-Overlayライクなオーバーレイ
[DataPuller](https://github.com/kOFReadie/BSDataPuller)の[BSDP-Overlay](https://github.com/kOFReadie/BSDP-Overlay)ライクなオーバーレイ表示用のHTMLとCSSを作成しました。

以下からダウンロードして、本オーバーレイのインストールフォルダに上書きで追加インストールすることで使用可能です。

[bsdp-like-overlay](https://github.com/rynan4818/bsdp-like-overlay)

## オーバーレイの改造
スクリプトでは特定のid属性値のHTMLタグに対して、プレイに合わせた書き換え動作をします。HTML内のid属性値は起動時にチェックし、存在しない場合は書き換え動作をしないため、HTMLやCSSを改造して好きなレイアウトや表示項目にすることが出来ます。

初心者向けに改造方法の記事を書きました。 [HTMLを知らない人にも分かる、オーバーレイの改造の仕方を説明してみる](https://note.com/rynan/n/n9a4207b7aed5)

また参考に、精度・スコア・曲名・bsr表示だけにしたシンプルな表示のhtmlを用意してあります。
```
file:///C:/TOOL/beat-saber-overlay/simple.html?modifiers=bsr
```

### HTMLのid属性値に対する動作一覧

| id属性値 | 動作 |
----|----
| overlay | プレイ開始時にclass="hidden"を削除、終了時に付与します。 |
| rank | スコアのランク(SS,S,A,B,C・・・)に書き換えます。 |
| percentage | スコアの精度(xx.x%)に書き換えます。 |
| combo | コンボ数に書き換えます。 |
| score | スコアに書き換えます。 |
| progress | 曲のプレイ時間に応じたstroke-dashoffsetスタイル値(半径30pxの円周値px)を設定します。 |
| image | src属性に曲のカバー画像をセットします。 |
| title | 曲のタイトルに書き換えます。 |
| subtitle | 曲のサブタイトル情報に書き換えます。 |
| artist | 曲のアーティスト情報に書き換えます。 |
| difficulty | 難易度情報に書き換えます。 |
| bpm | 曲のBPM情報に書き換えます。 |
| njs | NJS情報に書き換えます。 |
| njs_text | NJSの項目名を起動時に保持し、NJS表示が出来ない場合は表示を消します。 |
| bsr | BeatSaverのkey(bsr)情報に書き換えます。 |
| bsr_text | bsrの項目名を起動時に保持し、bsr表示が出来ない場合は表示を消します。 |
| mapper | 譜面の作者名を表示します。 |
| mapper_header | 譜面の作者名のヘッダー表示を起動時に保持し、表示出来ない場合は消します。 |
| mapper_footer | 譜面の作者名のフッター表示を起動時に保持し、表示出来ない場合は消します。 |
| song_time | プレイ中の曲の再生時間に書き換えます。 |
| song_length | 曲の長さの時間に書き換えます。 |
| mod | 適用中のmod(IF,BE,DA,GN,FS,SS,NF,NO,NB,NA)情報に書き換えます。 |
| miss | ミス数(ノーツミス)に書き換えます。 |
| pre_bsr | 一つ前にプレイした譜面のbsr情報を表示します。 |
| pre_bsr_text | pre_bsrの項目名を起動時に保持し、NJS表示が出来ない場合は表示を消します。　|
| energy | ライフ値(xxx%)に書き換えます。 |
| energy_bar | ライフ値に応じたwidthスタイル値(xxx%)を設定ます。 |
| energy_group | No Fail時にvisibilityスタイルをhiddenにします。 |
| now_pp | 現在のpp値に書き換えます。 |
| now_pp_text | now_ppの項目名を起動時に保持し、now_pp表示が出来ない場合は表示を消します。 |
| star | Star Difficulty値に書き換えます。 |
| star_text | starの項目名を起動時に保持し、star表示が出来ない場合は表示を消します。 |
| pp | 精度100%のpp値に書き換えます。 |
| pp_text | ppの項目名を起動時に保持し、pp表示が出来ない場合は表示を消します。 |

### modifiersオプションの追加
modifiersフォルダにCSSファイルを追加すると、CSSファイル名でmodifiersオプションを指定して読み込める様になります。
独自スタイルのCSSを作成した場合に任意のCSSファイルを作成することで、オリジナルのOverlayのファイル群を直接改造する必要がなくなるため、アップデートに追従しやすくなったり、他人に配布が容易になります。

### 外部スクリプト起動用オプション関数
オプションで以下の関数が存在すれば、呼び出されます。外部スクリプトは最初に読み込んで下さい。

| 関数(引数) | 説明 |
----|----
| op_performance(data,now_energy) | performanceが更新されるタイミングで呼び出されます |
| op_timer_update(time, delta, progress, percentage) | 曲時間表示が更新されるタイミングで呼び出されます |
| op_timer_update_sec(time, delta, progress, percentage) | 曲時間表示(秒毎)が更新されるタイミングで呼び出されます |
| op_beatmap(data,now_map,pre_map) | 譜面情報が更新されるタイミングで呼び出されます |
| op_beatsaver_res(now_map) | BeatSaverの譜面情報問い合わせのレスポンスがあった場合に呼び出されます |
| op_hide() | オーバーレイを隠すタイミングで呼び出されます |
| op_show() | オーバーレイを表示するタイミングで呼び出されます |
| op_hello(data) | HTTP Status の hello イベント時に呼び出されます |
| op_songStart(data) | HTTP Status の songStart イベント時に呼び出されます |
| op_noteCut(data) | HTTP Status の noteCut イベント時に呼び出されます |
| op_noteFullyCut(data) | HTTP Status の noteFullyCut イベント時に呼び出されます |
| op_obstacleEnter(data) | HTTP Status の obstacleEnter イベント時に呼び出されます |
| op_obstacleExit(data) | HTTP Status の obstacleExit イベント時に呼び出されます |
| op_noteMissed(data) | HTTP Status の noteMissed イベント時に呼び出されます |
| op_bombCut(data) | HTTP Status の bombCut イベント時に呼び出されます |
| op_finished(data) | HTTP Status の finished イベント時に呼び出されます |
| op_failed(data) | HTTP Status の failed イベント時に呼び出されます |
| op_softFailed(data) | HTTP Status の softFailed イベント時に呼び出されます |
| op_scoreChanged(data) | HTTP Status の scoreChanged イベント時に呼び出されます |
| op_energyChanged(data) | HTTP Status の energyChanged イベント時に呼び出されます(本家HTTPStatusは未実装) |
| op_pause(data) | HTTP Status の pause イベント時に呼び出されます |
| op_resume(data) | HTTP Status の resume イベント時に呼び出されます |
| op_menu(data) | HTTP Status の menu イベント時に呼び出されます |

| 引数 | 説明 |
----|----
| data | HTTP Status から送信されるJSONオブジェクトが格納されています |
| now_energy | ライフ値が格納されています(0～100 実数値[小数点有り]) |
| delta | 曲の経過時間(msec) |
| progress | 曲の経過時間(sec) |
| percentage | 曲の経過割合 |
| now_map | 現在の譜面のBeatSaver API 問い合わせ結果のJSONオブジェクト。但し、op_beatmapの時は前回と同じ譜面のプレイ時のみ格納、それ以外はnull |
| pre_map | 前回の譜面のBeatSaver API 問い合わせ結果のJSONオブジェクト。 |

## その他

他のオーバーレイでは一般的なGitHub Pages等による本オーバーレイの提供は以下を理由にあえて行いません。

- 本家の(Unnamed) Beat Saber OverlayではURL変更等によるトラブルが多かったこと
- GitHubに繋がらない場合など、ネットワークのトラブル時に使用できないこと
- 少し手間になるが、ダウンロードしてローカルで表示する使用方法で問題ないこと
