import { useContext } from "react";
import { Space, Typography, Grid, Flex } from "antd";
import Image from 'next/image';
import BasicCard from "@/components/basic-card";
import ThemeContext from '@/contexts/theme';
import { PageEntry } from '@/models/page';
import SUESMCIcon from '../../assets/mcclub.png';

const { Title } = Typography;

interface HomeCardListProps {
    pages: PageEntry[];
}

const HomeCardList = ({ pages }: HomeCardListProps) => {
    const themeCtx = useContext(ThemeContext);
    const screens = Grid.useBreakpoint();
    return (
    <Space direction="vertical" style={{width: '100%'}} size="large">
        <div className="home-title">
            <Flex justify="space-between" align="flex-start">
                <Title className="home-title" level={2}>
                    <span className="home-title-normal">程园我的世界社</span>
                    <br/>
                    <span className="home-title-highlighted">方 块 筑 梦</span>
                </Title>
                <Image src={SUESMCIcon} alt="SUESMC Icon" width={96} height={96} unoptimized/>
            </Flex>
        </div>
        {pages.map(page => (
            <BasicCard 
                key={page.id} 
                id={page.id.toString()} 
                title={page.title} 
                subtitle={page.subtitle} 
                content_type={page.type}
                logo_url={page.logo_url}
                banner_url={page.banner_url}
                style={{backgroundColor: themeCtx.userTheme === 'light' ? page.card_color_light : page.card_color_dark}}
            />
            ))
        }
    </Space>)
}

export default HomeCardList;