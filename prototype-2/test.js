const videos = document.getElementsByTagName("video");

const vp = new tmg.Player();
vp.build.playlist = [
    {
        media: {title: "Zack Snyder's Justice League Trailer", artist: "TMG MEDIA PROTOTYPE", artwork: [{src: "/TMG.com/SPARE-PICS/zack-snyder-justice-league-b.jpg"}],},
        src: "/TMG.com/MOVIES/Justice League/Zack Snyder's Justice League - Official Trailer - Warner Bros. UK.mp4",
    },
    {
        media: {title: "Madame Web Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/madame-web.png"}],},
        src: "/TMG.com/MOVIES/Madame Web/madame-web-trailer.mp4"
    },
    {
        media: {title: "Argylle Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/argylle-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Argylle/Argylle _ Official Trailer.mp4"
    },
    {
        media: {title: "Road House Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/road-house-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Road House/Road House - Official Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "Kung fu Panda Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/kung-fu-panda-4.png"}],},
        src: "/TMG.com/CARTOONS/Kung Fu Panda/KUNG FU PANDA 4 _ New Final Trailer (HD).mp4"
    },
    {
        media: {title: "The Underdoggs Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-underdoggs.jpg"}],},
        src: "/TMG.com/MOVIES/The Underdoggs/The Underdoggs - Official Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "Ricky Stanicky Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/ricky-stanicky-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Ricky Stanicky/Ricky Stanicky - Official Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "Avatar the last airbender Netflix Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/avatar-the-last-airbender-netflix-b.jpeg"}],},
        src: "/TMG.com/ANIME/Avatar the last airbender Netflix/avatar-the-last-airbender-netflix-videos/Avatar_ The Last Airbender _ Official Trailer _ Netflix.mp4"
    },
    {
        media: {title: "The Flash Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-flash-b.jpg"}],},
        src: "/TMG.com/MOVIES/The Flash/The Flash – Official Trailer.mp4"
    },
    {
        media: {title: "Damsel Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/damsel-d.jpg"}],},
        src: "/TMG.com/MOVIES/Damsel/Damsel _ Official Trailer _ Netflix.mp4"
    },           
    {
        media: {title: "The Marvels Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-marvels-d.png"}],},
        src: "/TMG.com/MOVIES/The Marvels/Marvel Studios' The Marvels _ Official Trailer.mp4"
    },
    {
        media: {title: "Gen V Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/gen-v.jpeg"}],},
        src: "/TMG.com/SERIES/Gen V/gen-v-videos/Gen V - Official Teaser Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "One Piece Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/one-piece-d.jpeg"}],},
        src: "/TMG.com/ANIME/One Piece Netflix/one-piece-netflix-videos/ONE PIECE _ Official Trailer _ Netflix.mp4"
    },
    {
        media: {title: "Atom Eve Special Episode Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/invincible_atom_eve-4.jpeg"}],},
        src: "/TMG.com/CARTOONS/Invincible/Invincible - Atom Eve Special Episode Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "Jujutsu Kaisen 0 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/jujutsu-kaisen-0-c.jpeg"}],},
        src: "/TMG.com/ANIME/Jujutsu Kaisen/jujutsu-kaisen-videos/JUJUTSU KAISEN 0 _ OFFICIAL TRAILER 3.mp4"
    },
    {
        media: {title: "Sing 2 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/sing-II-b.jpg"}],},
        src: "/TMG.com/CARTOONS/Sing/Sing 2 - Official Trailer [HD] (1).mp4"
    },
    {
        media: {title: "A Quiet Place II Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/a-quiet-place-d-s.jpeg"}],},
        src: "/TMG.com/MOVIES/A Quiet Place/A Quiet Place Part II (2021) - Final Trailer - Paramount Pictures.mp4"
    },
    {
        media: {title: "Guardians of the Galaxy Vol. 3 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/guardians-of-the-galaxy-III-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Guardians of the Galaxy/Marvel Studios’ Guardians of the Galaxy Vol. 3 _ New Trailer.mp4"
    },
    {
        media: {title: "The Thundermans Return Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-thundermans-return-c.jpeg"}],},
        src: "/TMG.com/MOVIES/The Thundermans Return/The Thundermans Return _ Official Trailer _ Paramount+.mp4"
    },
    {
        media: {title: "Bridgerton Season 1 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/bridgerton-b.jpeg"}],},
        src: "/TMG.com/SERIES/Bridgerton/bridgerton-videos/Bridgerton - Official Trailer - Netflix.mp4"
    },
    {
        media: {title: "Bridgerton Season 2 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/bridgerton-II-b.jpeg"}],},
        src: "/TMG.com/SERIES/Bridgerton/bridgerton-videos/Bridgerton Season 2 Trailer _ Rotten Tomatoes TV.mp4"
    },
    {
        media: {title: "Queen Charlotte Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/queen-charlotte-b.jpeg"}],},
        src: "/TMG.com/SERIES/Queen Charlotte/queen-charlotte-videos/Queen Charlotte_ A Bridgerton Story _ Official Trailer _ Netflix.mp4"
    },
    {
        media: {title: "The Boys Season 1 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-boys-e.jpeg"}],},
        src: "/TMG.com/SERIES/The Boys/the-boys-videos/The Boys - Official Trailer _ Prime Video.mp4"
    },
    {
        media: {title: "Ant Man and the Wasp Quantumania Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/antman-quantumania-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Ant-Man/Marvel Studios’ Ant-Man and The Wasp_ Quantumania _ New Trailer.mp4"
    },
    {
        media: {title: "Aquaman and the Lost Kingdom Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/aquaman-and-the-lost-kingdom-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Aquaman/Aquaman and the Lost Kingdom _ Trailer.mp4"
    },
    {
        media: {title: "Enola Holmes 2 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/enola-holmes-II-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Enola Holmes/Enola Holmes 2 _ Official Trailer_ Part 1 _ Netflix.mp4"
    },
    {
        media: {title: "The Beekeeper Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-beekeeper-a.jpeg"}],},
        src: "/TMG.com/MOVIES/The BeeKeeper/THE BEEKEEPER _ Official Restricted Trailer.mp4"
    },
    {
        media: {title: "Transformers Rise of the Beasts Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/rise-of-the-beast-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Transformers/Transformers_ Rise of the Beasts _ Official Trailer (2023 Movie).mp4"
    },
    {
        media: {title: "The Batman Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-batman-c.jpeg"}],},
        src: "/TMG.com/MOVIES/The Batman/THE BATMAN – Main Trailer.mp4"
    },
    {
        media: {title: "Spider-Man Across the Spider-Verse Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/spiderman-across-the-spiderverse-c.jpeg"}],},
        src: "/TMG.com/CARTOONS/Spider-Man Across the Spider-Verse/SPIDER-MAN_ ACROSS THE SPIDER-VERSE - Official Trailer (HD).mp4"
    },
    {
        media: {title: "Shazam Fury of the gods Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/shazam-II-c.jpeg"}],},
        src: "/TMG.com/MOVIES/Shazam/SHAZAM! FURY OF THE GODS - Official Trailer 1.mp4"
    },
    {
        media: {title: "The Book of Clarence Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-book-of-clarence-b.png"}],},
        src: "/TMG.com/MOVIES/The Book of Clarence/THE BOOK OF CLARENCE - Official Trailer (HD).mp4"
    },
    {
        media: {title: "A Tribe called Judah Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/a-tribe-called-judah-b.jpeg"}],},
        src: "/TMG.com/MOVIES/A Tribe Called Judah/A TRIBE CALLED JUDAH - OFFICIAL TRAILER - Showing In Cinemas From the 15th Dec.mp4"
    },
    {
        media: {title: "Stranger Things Season 1 Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/stranger-things-b.jpeg"}],},
        src: "/TMG.com/SERIES/Stranger Things/stranger-things-videos/Stranger Things _ Official Final Trailer _ Netflix.mp4"
    },   
    {
        media: {title: "Black Panther Wakanda Forever Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/black-panther-wakanda-forever-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Black Panther/Marvel Studios’ Black Panther_ Wakanda Forever _ Official Trailer.mp4"
    },   
    {
        media: {title: "Black Widow Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/black-widow.jpeg"}],},
        src: "/TMG.com/MOVIES/Black Widow/Marvel Studios' Black Widow _ Official Trailer.mp4"
    },           
    {
        media: {title: "Blue Beetle Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/blue-beetle-c.jpeg"}],},
        src: "/TMG.com/MOVIES/Blue Beetle/Blue Beetle – Official Trailer.mp4"
    },   
    {
        media: {title: "Blue Story Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/blue-story-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Blue Story/Blue Story (2020) – Official Trailer – Paramount Pictures.mp4"
    },   
    {
        media: {title: "Cinderella Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/cinderella-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Cinderella/Cinderella - Official Trailer _ Prime Video.mp4"
    },   
    {
        media: {title: "Dora and the lost city of gold Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/dora-and-the-lost-city-of-gold-a.jpeg"}],},
        src: "/TMG.com/MOVIES/Dora and the lost city of gold/Dora and the Lost City of Gold - Official Trailer - Paramount Pictures.mp4"
    },   
    {
        media: {title: "Jexi Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/jexi-c.jpeg"}],},
        src: "/TMG.com/MOVIES/Jexi/jexi-trailer.mp4"
    },   
    {
        media: {title: "Jungle Cruise Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/jungle-cruise-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Jungle Cruise/Disney's Jungle Cruise _ Official Trailer.mp4"
    },  
    {
        media: {title: "Morbius Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/morbius-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Morbius/MORBIUS - Official Trailer (HD).mp4"
    },       
    {
        media: {title: "Robin Hood Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/robin-hood-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Robin Hood/Robin Hood (2018 Movie) Official Trailer – Taron Egerton, Jamie Foxx, Jamie Dornan.mp4"
    },    
    {
        media: {title: "The Darkest Minds Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-darkest-minds-b.jpeg"}],},
        src: "/TMG.com/MOVIES/The Darkest Minds/The Darkest Minds _ Official Trailer [HD] _ 20th Century FOX.mp4"
    },    
    {
        media: {title: "The WomanTrailer", artwork: [{src: "/TMG.com/SPARE-PICS/the-woman-king-b.jpeg"}],},
        src: "/TMG.com/MOVIES/The Woman King/THE WOMAN KING – Official Trailer (HD).mp4"
    },     
    {
        media: {title: "Uncharted Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/uncharted-b.jpeg"}],},
        src: "/TMG.com/MOVIES/Uncharted/UNCHARTED - Official Trailer (HD).mp4"
    },    
    {
        media: {title: "Dahmer - Monster Trailer", artwork: [{src: "/TMG.com/SPARE-PICS/dahmer-b.jpeg"}],},
        src: "/TMG.com/SERIES/Monster/monster-videos/Dahmer - Monster_ The Jeffrey Dahmer Story Limited Series Trailer.mp4"
    },
];
vp.attach(videos[videos.length-1]);