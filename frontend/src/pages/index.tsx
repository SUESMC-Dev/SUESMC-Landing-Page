import react, { useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from 'next/image';
import { FloatButton, Grid, Layout } from "antd";
import { MoonOutlined, SunOutlined, GithubOutlined } from "@ant-design/icons";
import HomeCardList from "@/components/home-card-list";
import ThemeContext from '@/contexts/theme';
import { MessageContext } from '@/contexts/message';
import { PageEntry } from '@/models/page';
import BgLight from '../../assets/bg-light.png';
import BgDark from '../../assets/bg-dark.png';

const { useBreakpoint } = Grid;
const { Header, Footer, Content, Sider } = Layout;

interface HomePageProps {
    pages: PageEntry[];
}

export default function HomePage({ pages }: HomePageProps) {
  const screens = useBreakpoint();
  const message = useContext(MessageContext);
  const themeCtx = useContext(ThemeContext);

  const renderBackgroundLayer = () => (
    <div className="bg-image-layer" aria-hidden="true">
      <div className={`theme-background-image ${themeCtx.userTheme === 'light' ? 'is-visible' : ''}`}>
        <Image src={BgLight}
          alt=""
          unoptimized
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={`theme-background-image ${themeCtx.userTheme === 'dark' ? 'is-visible' : ''}`}>
        <Image src={BgDark}
          alt=""
          unoptimized
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>程园我的世界社 - SUESMC</title>
        <meta name="description" content="程园我的世界社！上海工程技术大学 Minecraft 社团官方网站，提供社团介绍、服务器连接、用户中心等服务。" />
        <meta name="keywords" content="SUESMC, 程园我的世界社, 上海工程技术大学, Minecraft, 社团, 服务器, 游戏" />
        <meta property="og:title" content="程园我的世界社 - SUESMC" />
        <meta property="og:description" content="程园我的世界社！上海工程技术大学 Minecraft 社团官方网站，提供社团介绍、服务器连接、用户中心等服务。" />
        <meta property="og:image" content="/assets/suesmc.png" />
        <meta property="og:url" content="https://suesmc.ltd" />
      </Head>
      <Layout className={screens.lg ? "lp-layout desktop" : "lp-layout"}>
        {!screens.lg && /* For mobile devices */
          <><Header className="layout-header">
            {renderBackgroundLayer()}
          </Header>
          <Content className="layout-content">
            <HomeCardList pages={pages}/>
          </Content></>
        }
        {screens.lg && /* For desktop devices */
          <Layout>
            <Sider width="60%" className="layout-sider">
              {renderBackgroundLayer()}
            </Sider>
            <Content className="layout-content-desktop">
              <HomeCardList pages={pages}/>
            </Content>
          </Layout>
        }
        <Footer className="layout-footer">
          <div>SUESMC ｜ <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备2023020312号-1</a></div>
          <div>改编自 <a href="https://mc.sjtu.cn/welcome/">SJMC-Landing-Page</a></div>
        </Footer>
      </Layout>
      <FloatButton.Group 
          shape="square"
          style={screens.lg ? { bottom: 60, right: 30 } : { bottom: 48, right: 20 }}
      >
          {screens.lg && <FloatButton 
              icon={<GithubOutlined />}
              href="https://github.com/UNIkeEN/SJMC-Landing-Page"
              target="_blank"
          />}
          <FloatButton
              onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
              icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
          />
      </FloatButton.Group>
    </>
  );
}

import * as fs from 'fs';
import path from 'path';

export async function getStaticProps() {
    const filePath = path.join(process.cwd(), './api/list-pages/index.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const pages = JSON.parse(fileContents);
    return { props: { pages } };
}
