import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import api from "../../services/api";
import { usePlayer } from "../../contexts/PlayerContext";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss";


interface Episode {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
    description: string;
    url: string;
}

interface EpisodeProps{
    episodes: Episode;
}


export default function Episode({ episodes }: EpisodeProps){
    const { play } = usePlayer();
    return (
        <div className={styles.episode}>
            <Head>
                <title>{episodes.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={episodes.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episodes)}>
                <img src="/play.svg" alt="Tocar episódio"/>    
                </button>
            </div>

            <header>
                <h1>{episodes.title}</h1>
                <span>{episodes.members}</span>
                <span>{episodes.publishedAt}</span>
                <span>{episodes.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episodes.description}} />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get("/episodes", {
        params: {
            _limit: 2,
            _sort: "published_at",
            _order: "desc"
        }
    });

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params
    const { data } = await api.get(`/episodes/${slug}`);


    const episodes = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {
            locale: ptBR
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };

    return {
        props: {
            episodes
        },
        revalidate: 60 * 60 * 24 // 24hours
    }
}