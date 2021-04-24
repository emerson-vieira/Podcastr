import { createContext, ReactNode, useContext, useState } from "react";

interface Episode {
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    url: string;
}

interface PayerContextData {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}

interface PlayerProviderProps {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PayerContextData);

export function PlayerProvider({ children }: PlayerProviderProps){
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }
    
    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext(){
        const nextEpisodeIndex = currentEpisodeIndex + 1;
        if(isShuffling){
            const nexRondomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nexRondomEpisodeIndex);
        }else if(hasNext){
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider 
            value={{ 
                episodeList, 
                currentEpisodeIndex, 
                isPlaying,
                hasPrevious,
                hasNext,
                isLooping,
                isShuffling,
                play, 
                togglePlay,
                setPlayingState ,
                playList,
                playNext,
                playPrevious,
                toggleLoop,
                toggleShuffle,
                clearPlayerState
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const  usePlayer = () => {
    return useContext(PlayerContext);
}