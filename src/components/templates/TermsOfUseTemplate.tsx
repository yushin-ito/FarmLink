import React from "react";

import { Feather } from "@expo/vector-icons";
import {
  Box,
  HStack,
  Heading,
  Text,
  Icon,
  IconButton,
  useColorModeValue,
  ScrollView,
  VStack,
} from "native-base";
import { useTranslation } from "react-i18next";

type TermsOfUseTemplateProps = {
  goBackNavigationHandler: () => void;
};

const TermsOfUseTemplate = ({
  goBackNavigationHandler,
}: TermsOfUseTemplateProps) => {
  const { t } = useTranslation("app");

  const iconColor = useColorModeValue("muted.600", "muted.100");

  return (
    <Box flex={1} safeAreaTop>
      <HStack mb="2" px="2" alignItems="center" justifyContent="space-between">
        <IconButton
          onPress={goBackNavigationHandler}
          icon={
            <Icon
              as={<Feather name="chevron-left" />}
              size="2xl"
              color={iconColor}
            />
          }
          variant="unstyled"
        />
        <Heading>{t("termsOfUse")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <ScrollView px="8" contentContainerStyle={{ paddingBottom: 80 }}>
        <VStack space="8">
          <Text fontSize="md">
            この規約は、お客様が、「Farmlink」サービス（以下「本サービス」）をご利用頂く際の取扱いにつき定めるものです。本規約に同意した上で本サービスをご利用ください。
          </Text>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第1条
              </Text>
              <Text bold fontSize="lg">
                定義
              </Text>
            </HStack>
            <Text fontSize="md">
              本規約上で使用する用語の定義は、次に掲げるとおりとします。
            </Text>
            <VStack>
              <Text fontSize="md">1. 本サービス</Text>
              <Text fontSize="md">
                当運営チームが運営するサービス及び関連するサービス
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">2. 本コンテンツ</Text>
              <Text fontSize="md">
                本サービス上で提供される文字、音、静止画、動画、ソフトウェアプログラム、コード等の総称（投稿情報を含む）
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">3. 利用者</Text>
              <Text fontSize="md">本サービスを利用する全ての方</Text>
            </VStack>
            <VStack>
              <Text fontSize="md">4. 登録利用者</Text>
              <Text fontSize="md"> 本サイトの利用者登録が完了した方</Text>
            </VStack>
            <VStack>
              <Text fontSize="md">5. ID</Text>
              <Text fontSize="md">
                本サービスの利用のために登録利用者が固有に持つ文字列
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">6. パスワード</Text>
              <Text fontSize="md">
                IDに対応して登録利用者が固有に設定する暗号
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">7. 個人情報</Text>
              <Text fontSize="md">
                住所、氏名、職業、電話番号等個人を特定することのできる情報の総称
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">8. 登録情報</Text>
              <Text fontSize="md">
                登録利用者が本サイトにて登録した情報の総称（投稿情報は除く）
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">9. 知的財産</Text>
              <Text fontSize="md">
                発明、考案、植物の新品種、意匠、著作物その他の人間の創造的活動により生み出されるもの（発見または解明がされた自然の法則または現象であって、産業上の利用可能性があるものを含む）、商標、商号その他事業活動に用いられる商品または役務を表示するもの及び営業秘密その他の事業活動に有用な技術上または営業上の情報
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="md">10. 知的財産権</Text>
              <Text fontSize="md">
                特許権、実用新案権、育成者権、意匠権、著作権、商標権その他の知的財産に関して法令により定められた権利または法律上保護される利益に係る権利
              </Text>
            </VStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第2条
              </Text>
              <Text bold fontSize="lg">
                本規約への同意
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                利用者は、本利用規約に同意頂いた上で、本サービスを利用できるものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                利用者が、本サービスをスマートフォンその他の情報端末にダウンロードし、本規約への同意手続を行った時点で、利用者と当運営チームとの間で、本規約の諸規定に従った利用契約が成立するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                利用者が未成年者である場合には、親権者その他の法定代理人の同意を得たうえで、本サービスをご利用ください。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                未成年者の利用者が、法定代理人の同意がないにもかかわらず同意があると偽りまたは年齢について成年と偽って本サービスを利用した場合、その他行為能力者であることを信じさせるために詐術を用いた場合、本サービスに関する一切の法律行為を取り消すことは出来ません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">5. </Text>
              <Text fontSize="md">
                本規約の同意時に未成年であった利用者が成年に達した後に本サービスを利用した場合、当該利用者は本サービスに関する一切の法律行為を追認したものとみなされます。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第3条
              </Text>
              <Text bold fontSize="lg">
                規約の変更
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、利用者の承諾を得ることなく、いつでも、本規約の内容を改定することができるものとし、利用者はこれを異議なく承諾するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームは、本規約を改定するときは、その内容について当運営チームよりアプリ内又は登録されたメールアドレスを通して利用者に通知します。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                前本規約の改定の効力は、当運営チームが前項により通知を行った時点から生じるものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                利用者は、本規約変更後、本サービスを利用した時点で、変更後の本利用規約に異議なく同意したものとみなされます。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第4条
              </Text>
              <Text bold fontSize="lg">
                会員の入会手続
              </Text>
            </HStack>
            <Text fontSize="md">
              1.本サービスへの入会を希望する方（以下「登録希望者」）は、本規約に同意した上で、所定の方法で入会の申込を行ってください。
            </Text>
            <Text fontSize="md">
              2.入会の申込をした方は、当運営チームがその申込を承諾し、ID登録が完了した時点から登録ユーザとなります。
            </Text>
            <Text fontSize="md">
              3.弊社は、登録希望者が次の各号のいずれか一つに該当する場合は、弊社の判断により入会申込を承諾しないことがあります。
            </Text>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  登録希望者が、弊社の定める方法によらず入会の申込を行った場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  登録希望者が、過去に本規約または弊社の定めるその他の利用規約等に違反したことを理由として退会処分を受けた者である場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  登録希望者が、不正な手段をもって登録を行っていると弊社が判断した場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  登録情報の全部または一部につき虚偽、誤記又は記載漏れがあった場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  未成年者、成年被後見人、被保佐人又は非補助人のいずれかであり、法定代理人、後見人、保佐人又は補助人の同意等を得ていなかった場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  反社会的勢力等（暴力団または暴力団員、反社会的勢力、その他これに準ずる者を意味します。以下同じ。）である、又は資金提供その他を通じて反社会的勢力等の維持、運営もしくは経営に協力もしくは関与する等反社会的勢力等との何らかの交流もしくは関与を行っていると判断した場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md"> その他弊社が不適切と判断した場合</Text>
              </HStack>
            </VStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第5条
              </Text>
              <Text bold fontSize="lg">
                アカウントの管理
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                利用者は、利用に際して登録した情報（以下、「登録情報」といいます。メールアドレスやID・パスワード等を含みます）について、真実・正確
                ・完全な情報を提供し、以下に該当しないものでなければなりません。
              </Text>
            </HStack>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  暴力的な表現、反社会的な勢力を想起させる、又は、性的な表現に該当し公序良俗に反する恐れがあるもの
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  第三者の知的財産権を侵害する可能性があるもの
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md"> その他、上記各号に準じるもの</Text>
              </HStack>
            </VStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                前項の登録情報について変更が生じた場合、ユーザは直ちに当運営チーム指定の手続きに従って、変更情報を当運営チームに提供するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                自己の責任の下、任意に登録、管理するものとします。利用者は、これを第三者に利用させ、または貸与、譲渡、名義変更、売買などをしてはならないものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                当運営チームは、登録情報によって本サービスの利用があった場合、利用登録をおこなった本人が利用したものと扱うことができ、当該利用によって生じた結果ならびにそれに伴う一切の責任については、利用登録を行った本人に帰属するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">5. </Text>
              <Text fontSize="md">
                利用者は、登録情報の不正使用によって当運営チームまたは第三者に損害が生じた場合、当運営チームおよび第三者に対して、当該損害を賠償するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">6. </Text>
              <Text fontSize="md">
                登録情報の管理は、利用者が自己の責任の下で行うものとし、登録情報が不正確または虚偽であったために利用者が被った一切の不利益および損害に関して、当運営チームは責任を負わないものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">7. </Text>
              <Text fontSize="md">
                登録情報が盗用されまたは第三者に利用されていることが判明した場合、利用者は直ちにその旨を当運営チームに通知するとともに、当運営チームからの指示に従うものとします。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第6条
              </Text>
              <Text bold fontSize="lg">
                情報の保存
              </Text>
            </HStack>
            <Text fontSize="md">
              当運営チームは、登録ユーザーが送受信したメッセージ、投稿情報その他の情報を運営上一定期間保存していた場合であっても、かかる情報を保存する義務を負うものではなく、当運営チームは
              いつでもこれらの情報を削除できるものとします。なお、当運営チームは本条に基づき当運営チームが行った措置に基づき登録ユーザーに生じた損害について一切の責任を負いません。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第7条
              </Text>
              <Text bold fontSize="lg">
                個人情報等の取り扱い
              </Text>
            </HStack>
            <Text fontSize="md">
              個人情報及び利用者情報については、当運営チームが別途定める「Farmlinkサービスプライバシーポリシー」に則り、適正に取り扱うこととします。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第8条
              </Text>
              <Text bold fontSize="lg">
                禁止行為
              </Text>
            </HStack>
            <Text fontSize="md">
              本サービスの利用に際し、当運営チームは、利用者に対し、次に掲げる行為を禁止します。当運営チームにおいて、利用者が禁止事項に違反したと認めた場合、利用者用の一時停止、退会処分その他当運営チームが必要と判断した措置を取ることができます。
            </Text>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  犯罪行為に関する行為又は公序良俗に反する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム又は第三者の知的財産権を侵害する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム又は第三者の名誉・信用を毀損または不当に差別もしくは誹謗中傷する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム又は第三者の財産を侵害する行為、または侵害する恐れのある行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム又は第三者に経済的損害を与える行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム又は第三者に対する脅迫的な行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">異性交際に関する情報を送信する行為</Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  事実に反する情報又はその恐れのある情報を送信する行為及び事実に反する情報において、本サービスへ登録する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  アダルト画像、動画を含む情報及びそれを示唆する情報を送信する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  アダルトサイト、出会い系サイト関連の表現・内容又はこれらのサイト等へのリンクを送信する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム、本サービスの他の利用者、その他本サービスに関連する人物もしくは団体等を装い、身分を偽る行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  コンピューターウィルス、有害なプログラムを仕様またはそれを誘発する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  本サービス用インフラ設備に対して過度な負担となるストレスをかける行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当アプリのサーバーやシステム、セキュリティへの攻撃
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チーム提供のインターフェース以外の方法で当運営チームのサービスにアクセスを試みる行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  一人の利用者が、複数の利用者IDを取得する行為
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  上記の他、当運営チームが不適切と判断する行為
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第9条
              </Text>
              <Text bold fontSize="lg">
                免責事項
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、本サービスの内容変更、中断、終了によって生じたいかなる損害についても、一切責任を負いません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームは、利用者の本サービスの利用環境について一切関与せず、また一切の責任を負いません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                当運営チームは、本サービスが利用者の特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること、利用者による本サービスの利用が利用者に適用のある法令または業界団体の内部規則等に適合すること、および不具合が生じないことについて、何ら保証するものではありません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                当運営チームは、本サービスが全ての情報端末に対応していることを保証するものではなく、本サービスの利用に供する情報端末のＯＳのバージョンアップ等に伴い、本サービスの動作に不具合が生じる可能性があることにつき、利用者はあらかじめ了承するものとします。当運営チームは、かかる不具合が生じた場合に当運営チームが行うプログラムの修正等により、当該不具合が解消されることを保証するものではありません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">5. </Text>
              <Text fontSize="md">
                利用者は、AppStoreのサービスストアの利用規約および運用方針の変更等に伴い、本サービスの一部又は全部の利用が制限される可能性があることをあらかじめ了承するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">6. </Text>
              <Text fontSize="md">
                当運営チームは、本サービスを利用したことにより直接的または間接的に利用者に発生した損害について、一切賠償責任を負いません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">7. </Text>
              <Text fontSize="md">
                当運営チームは、利用者その他の第三者に発生した機会逸失、業務の中断その他いかなる損害（間接損害や逸失利益を含みます）に対して、当運営チームが係る損害の可能性を事前に通知されていたとしても、一切の責任を負いません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">8. </Text>
              <Text fontSize="md">
                前項の規定は、当運営チームに故意または重過失が存する場合又は契約書が消費者契約法上の消費者に該当する場合には適用しません。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">9. </Text>
              <Text fontSize="md">
                前項が適用される場合であっても、当運営チームは、過失（重過失を除きます。）による行為によって利用者に生じた損害のうち、特別な事情から生じた損害については、一切賠償する責任を負わないものとします。.
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">10. </Text>
              <Text fontSize="md">
                本サービスの利用に関し当運営チームが損害賠償責任を負う場合、当該損害が発生した月に利用者から受領した利用額を限度として賠償責任を負うものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">11. </Text>
              <Text fontSize="md">
                利用者と他の利用者との間の紛争及びトラブルについて、当運営チームは一切責任を負わないものとします。利用者と他の利用者でトラブルになった場合でも、両者同士の責任で解決するものとし、当運営チームには一切の請求をしないものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">12. </Text>
              <Text fontSize="md">
                利用者は、本サービスの利用に関連し、他の利用者に損害を与えた場合または第三者との間に紛争を生じた場合、自己の費用と責任において、かかる損害を賠償またはかかる紛争を解決するものとし、当運営チームには一切の迷惑や損害を与えないものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">13. </Text>
              <Text fontSize="md">
                利用者の行為により、第三者から当運営チームが損害賠償等の請求をされた場合には、利用者の費用（弁護士費用）と責任で、これを解決するものとします。当運営チームが、当該第三者に対して、損害賠償金を支払った場合には、利用者は、当運営チームに対して当該損害賠償金を含む一切の費用（弁護士費用及び逸失利益を含む）を支払うものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">14. </Text>
              <Text fontSize="md">
                利用者が本サービスの利用に関連して当運営チームに損害を与えた場合、利用者の費用と責任において当運営チームに対して損害を賠償（訴訟費用及び弁護士費用を含む）するものとします。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第10条
              </Text>
              <Text bold fontSize="lg">
                権利譲渡の禁止
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                利用者は、予め当運営チームの書面による承諾がない限り、本規約上の地位および本規約に基づく権利または義務の全部または一部を第三者に譲渡してはならないものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームは、本サービスの全部または一部を当運営チームの裁量により第三者に譲渡することができ、その場合、譲渡された権利の範囲内で利用者のアカウントを含む、本サービスに係る利用者の一切の権利が譲渡先に移転するものとします。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第11条
              </Text>
              <Text bold fontSize="lg">
                料金及び支払方法
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                利用者は、本サブスクサービス利用の対価として、別途当運営チームが定めた契約期間に応じた当運営チーム所定の料金（以下、「基本料金」といいます。）及び、当運営チームがオプションとして利用者に有料の個別サービスを提供した場合の当該料金を、当運営チームが指定する支払方法（以下「指定支払方法」といいます。）により当運営チームに支払うものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                前項の料金の支払いに必要な手数料その他の費用は、当該利用者が負担するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                Appleなどのプラットフォーム上で購入可能な本サブスクサービスについては、対象プラットフォームを通じて課金され、対象プラットフォームの支払い規約が適用されます。利用者は、対象プラットフォームの支払い規約全文を読んだうえで、これに同意したものとみなします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                利用者が第1項の料金の支払いを遅滞した場合、利用者は年14.6%の割合による遅延損害金を当運営チームに支払うものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">5. </Text>
              <Text fontSize="md">
                料金支払い後、適用されるで義務付けられる場合を除き、払い戻しは行いません。本サブスクサービス利用者はこれ同意したものとみなします。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第12条
              </Text>
              <Text bold fontSize="lg">
                本契約の解約
              </Text>
            </HStack>
            <Text fontSize="md">
              利用者は、本契約の解約を希望する場合、本契約の更新日の24時間以上前に、「設定
              → 支払い設定 →
              プラン変更」から解約するものとします。なお、解約した場合であっても、基本料金等について日割り計算による精算は行わず、解約後においても利用期間満了日までは、本サブスクサービスを利用できるものとします。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第13条
              </Text>
              <Text bold fontSize="lg">
                分離可能性
              </Text>
            </HStack>
            <Text fontSize="md">
              本規約のいずれかの条項又はその一部が、消費者契約法その他の法令等により無効又は執行不能と判断された場合であっても、本規約の残りの規定及び一部が無効又は執行不能と判断された規定の残りの部分は、継続して完全に効力を有するものとします。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第14条
              </Text>
              <Text bold fontSize="lg">
                問い合わせ
              </Text>
            </HStack>
            <Text fontSize="md">
              本サービスに関する利用者の当運営チームへのお問い合わせは、本サービスのアプリ内における適宜の場所に設置するお問い合わせフォームからの送信または当運営チームが別途指定する方法により行うものとします。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第7条
              </Text>
              <Text bold fontSize="lg">
                準拠法及び管轄裁判所
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                本規約の有効性，解釈及び履行については，日本法に準拠し，日本法に従って解釈されるものとする。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームと利用者等との間での論議・訴訟その他一切の紛争については、訴額に応じて、東京簡易裁判所又は東京地方裁判所を専属的合意管轄裁判所とします｡
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default TermsOfUseTemplate;
