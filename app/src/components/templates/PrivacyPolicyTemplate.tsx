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
  VStack,
  ScrollView,
} from "native-base";
import { useTranslation } from "react-i18next";

type PrivacyPolicyTemplateProps = {
  goBackNavigationHandler: () => void;
};

const PrivacyPolicyTemplate = ({
  goBackNavigationHandler,
}: PrivacyPolicyTemplateProps) => {
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
        <Heading>{t("privacyPolicy")}</Heading>
        <IconButton
          onPress={goBackNavigationHandler}
          icon={<Icon as={<Feather name="x" />} size="xl" color={iconColor} />}
          variant="unstyled"
        />
      </HStack>
      <ScrollView px="8" contentContainerStyle={{ paddingBottom: 80 }}>
        <VStack space="8">
          <Text fontSize="md">
            この規約は、「FarmLink」サービス（以下、「本サービス」といいます。）におけるユーザーの個人情報の取扱いにつき定めるものです。本ポリシーに同意した上で本サービスをご利用ください。
          </Text>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第1条
              </Text>
              <Text bold fontSize="lg">
                個人情報
              </Text>
            </HStack>
            <Text fontSize="md">
              「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第2条
              </Text>
              <Text bold fontSize="lg">
                本ポリシーへの同意
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                利用者は、本ポリシーに同意頂いた上で、本サービスを利用できるものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                利用者が、本ポリシーをスマートフォンその他の情報端末にダウンロードし、本ポリシーへの同意手続を行った時点で、利用者と当運営チームとの間で、本ポリシーの諸規定に従った利用契約が成立するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                本ポリシーの同意時に未成年であった利用者が成年に達した後に本サービスを利用した場合、当該利用者は本サービスに関する一切の法律行為を追認したものとみなされます。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第3条
              </Text>
              <Text bold fontSize="lg">
                個人情報の収集方法
              </Text>
            </HStack>
            <Text fontSize="md">
              当運営チームは、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を,当運営チームの提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。
            </Text>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第4条
              </Text>
              <Text bold fontSize="lg">
                個人情報を収集・利用する目的
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">当運営チームサービスの提供・運営のため</Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当運営チームが提供する
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                メンテナンス、重要なお知らせなど必要に応じたご連絡のため
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">5. </Text>
              <Text fontSize="md">
                利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">6. </Text>
              <Text fontSize="md">
                ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">7. </Text>
              <Text fontSize="md">
                有料サービスにおいて、ユーザーに利用料金を請求するため
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">8. </Text>
              <Text fontSize="md">上記の利用目的に付随する目的</Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第5条
              </Text>
              <Text bold fontSize="lg">
                利用目的の変更
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                利用目的の変更を行った場合には、変更後の目的について、当運営チーム所定の方法により、ユーザーに通知します
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第6条
              </Text>
              <Text bold fontSize="lg">
                個人情報の第三者提供
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
              </Text>
            </HStack>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  予め次の事項を告知あるいは公表し、かつ当運営チームが個人情報保護委員会に届出をしたとき
                </Text>
              </HStack>
            </VStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
              </Text>
            </HStack>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チームが利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  合併その他の事由による事業の承継に伴って個人情報が提供される場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、または本人が容易に知り得る状態に置いた場合
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第7条
              </Text>
              <Text bold fontSize="lg">
                個人情報の開示
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。なお、個人情報の開示に際しては、1件あたり1、000円の手数料を申し受けます。
              </Text>
            </HStack>
            <VStack space="1">
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">
                  当運営チームの業務の適正な実施に著しい支障を及ぼすおそれがある場合公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="md">・ </Text>
                <Text fontSize="md">その他法令に違反することとなる場合</Text>
              </HStack>
            </VStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第8条
              </Text>
              <Text bold fontSize="lg">
                個人情報の訂正および削除
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                ユーザーは、当運営チームの保有する自己の個人情報が誤った情報である場合には、当運営チームが定める手続きにより、当運営チームに対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                当運営チームは、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第9条
              </Text>
              <Text bold fontSize="lg">
                個人情報の利用停止等
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                当運営チームは、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                前項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第10条
              </Text>
              <Text bold fontSize="lg">
                個人情報の利用停止等
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">1. </Text>
              <Text fontSize="md">
                当運営チームは、利用者の承諾を得ることなく、いつでも、本ポリシーの内容を改定することができるものとし、利用者はこれを異議なく承諾するものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">2. </Text>
              <Text fontSize="md">
                当運営チームは、本ポリシーを改定するときは、その内容について当運営チーム所定の方法によりユーザーに通知します。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">3. </Text>
              <Text fontSize="md">
                本ポリシーの改定の効力は、当運営チームが前項により通知を行った時点から生じるものとします。
              </Text>
            </HStack>
            <HStack>
              <Text fontSize="md">4. </Text>
              <Text fontSize="md">
                利用者は、本ポリシー変更後、本サービスを利用した時点で、変更後の本ポリシーに異議なく同意したものとみなされます。
              </Text>
            </HStack>
          </VStack>
          <VStack space="3">
            <HStack space="3">
              <Text bold fontSize="lg">
                第11条
              </Text>
              <Text bold fontSize="lg">
                問い合わせ
              </Text>
            </HStack>
            <Text fontSize="md">
              本ポリシーに関する利用者の当運営チームへのお問い合わせは、本ポリシーのアプリ内における適宜の場所に設置するお問い合わせフォームからの送信または当運営チームが別途指定する方法により行うものとします。
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default PrivacyPolicyTemplate;
