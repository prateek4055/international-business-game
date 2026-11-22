import React, { useRef, useState, useEffect } from 'react';
import { BoardSpace, BOARD_SPACES, Player } from '../data/boardData';
import {
  Card,
  SideCard,
  BoardCard,
  rules,
} from './International';

import generatedIllustrationAirways from "./generated-illustration-AIRWAYS.webp";
import generatedIllustrationAustralia from "./generated-illustration-AUSTRALIA.webp";
import generatedIllustrationBrazil from "./generated-illustration-BRAZIL.webp";
import generatedIllustrationCanada from "./generated-illustration-CANADA.webp";
import generatedIllustrationChance from "./generated-illustration-CHANCE.webp";
import generatedIllustrationChance2 from "./generated-illustration-CHANCE-2.webp";
import generatedIllustrationChina from "./generated-illustration-CHINA.webp";
import generatedIllustrationCustomDuty from "./generated-illustration-CUSTOM-DUTY.webp";
import generatedIllustrationEgypt from "./generated-illustration-EGYPT.webp";
import generatedIllustrationEngland from "./generated-illustration-ENGLAND.webp";
import generatedIllustrationFrance from "./generated-illustration-FRANCE.webp";
import generatedIllustrationGermany from "./generated-illustration-GERMANY.webp";
import generatedIllustrationHongkong from "./generated-illustration-HONGKONG.webp";
import generatedIllustrationIndia from "./generated-illustration-INDIA.webp";
import generatedIllustrationIran from "./generated-illustration-IRAN.webp";
import generatedIllustrationIraq from "./generated-illustration-IRAQ.webp";
import generatedIllustrationItaly from "./generated-illustration-ITALY.webp";
import generatedIllustrationJail from "./generated-illustration-JAIL.webp";
import generatedIllustrationJapan from "./generated-illustration-JAPAN.webp";
import generatedIllustrationMalaysia from "./generated-illustration-MALAYSIA.webp";
import generatedIllustrationMexico from "./generated-illustration-MEXICO.webp";
import generatedIllustrationPartyHouse from "./generated-illustration-PARTY-HOUSE.webp";
import generatedIllustrationPetroleum from "./generated-illustration-PETROLEUM.webp";
import generatedIllustrationRailways from "./generated-illustration-RAILWAYS.webp";
import generatedIllustrationResort from "./generated-illustration-RESORT.webp";
import generatedIllustrationRoadways from "./generated-illustration-ROADWAYS.webp";
import generatedIllustrationSatellite from "./generated-illustration-SATELLITE.webp";
import generatedIllustrationSaudiArabia from "./generated-illustration-SAUDI-ARABIA.webp";
import generatedIllustrationSingapore from "./generated-illustration-SINGAPORE.webp";
import generatedIllustrationStart from "./generated-illustration-START.webp";
import generatedIllustrationSwitzerland from "./generated-illustration-SWITZERLAND.webp";
import generatedIllustrationTravellingDuty from "./generated-illustration-TRAVELLING-DUTY.webp";
import generatedIllustrationUno from "./generated-illustration-UNO.webp";
import generatedIllustrationUsa from "./generated-illustration-USA.webp";
import generatedIllustrationWaterways from "./generated-illustration-WATERWAYS.webp";
import image from "./image.webp";

interface BoardSpaceConfig {
  index: number;
  card: BoardCard;
  isLarge?: boolean;
  isSide?: boolean;
  top: number;
  left: number;
}

const SPACES_CONFIG: BoardSpaceConfig[] = [
  // 0: START
  { index: 0, top: 1323, left: 1323, isLarge: true, card: { name: "START", image: generatedIllustrationStart, color: "#D86672", value: "COLLECT $1500" } },
  // 1: ENGLAND (Red)
  { index: 1, top: 1194, left: 1323, isSide: true, card: { name: "ENGLAND", image: generatedIllustrationEngland, color: "#D86672", value: "$2500" } },
  // 2: IRAQ (Green)
  { index: 2, top: 1064, left: 1323, isSide: true, card: { name: "IRAQ", image: generatedIllustrationIraq, color: "#91B65A", value: "$2500" } },
  // 3: WATERWAYS (Utility)
  { index: 3, top: 935, left: 1323, isSide: true, card: { name: "WATERWAYS", image: generatedIllustrationWaterways, color: "#A8B7C9", value: "$9500", fontSize: "text-[19px]" } },
  // 4: UNO (Special)
  { index: 4, top: 806, left: 1323, isSide: true, card: { name: "UNO", image: generatedIllustrationUno, color: "#326BA8", value: "UNITED NATIONS", fontSize: "text-[11.2px]" } },
  // 5: FRANCE (Red)
  { index: 5, top: 676, left: 1323, isSide: true, card: { name: "FRANCE", image: generatedIllustrationFrance, color: "#D86672", value: "$2500" } },
  // 6: IRAN (Green)
  { index: 6, top: 547, left: 1323, isSide: true, card: { name: "IRAN", image: generatedIllustrationIran, color: "#91B65A", value: "$2500" } },
  // 7: SATELLITE (Utility)
  { index: 7, top: 417, left: 1323, isSide: true, card: { name: "SATELLITE", image: generatedIllustrationSatellite, color: "#A8B7C9", value: "$2000", fontSize: "text-[19px]" } },
  // 8: EGYPT (Green)
  { index: 8, top: 288, left: 1323, isSide: true, card: { name: "EGYPT", image: generatedIllustrationEgypt, color: "#91B65A", value: "$3200" } },
  // 9: RESORT (Special)
  { index: 9, top: 25, left: 1323, isLarge: true, card: { name: "RESORT", image: generatedIllustrationResort, color: "#23877F" } },
  // 10: CANADA (Yellow)
  { index: 10, top: 25, left: 1194, card: { name: "CANADA", image: generatedIllustrationCanada, color: "#EDB64D", value: "$4000" } },
  // 11: GERMANY (Red)
  { index: 11, top: 25, left: 1064, card: { name: "GERMANY", image: generatedIllustrationGermany, color: "#D86672", value: "$3500", fontSize: "text-[15px]" } },
  // 12: AIRWAYS (Utility)
  { index: 12, top: 25, left: 935, card: { name: "AIRWAYS", image: generatedIllustrationAirways, color: "#A8B7C9", value: "$10500", fontSize: "text-[15px]" } },
  // 13: CUSTOM DUTY (Special)
  { index: 13, top: 25, left: 806, card: { name: "CUSTOM DUTY", image: generatedIllustrationCustomDuty, color: "#74699C", value: "ON ITEMS", fontSize: "text-xs" } },
  // 14: SWITZERLAND (Red)
  { index: 14, top: 25, left: 676, card: { name: "SWITZERLAND", image: generatedIllustrationSwitzerland, color: "#D86672", value: "$3500", fontSize: "text-xs" } },
  // 15: BRAZIL (Yellow)
  { index: 15, top: 25, left: 547, card: { name: "BRAZIL", image: generatedIllustrationBrazil, color: "#EDB64D", value: "$2500" } },
  // 16: CHANCE (Special)
  { index: 16, top: 25, left: 417, card: { name: "CHANCE", image: generatedIllustrationChance, color: "#EDB64D", imageClass: "h-[196px]" } },
  // 17: ITALY (Red)
  { index: 17, top: 25, left: 288, card: { name: "ITALY", image: generatedIllustrationItaly, color: "#D86672", value: "$3500" } },
  // 18: PARTY HOUSE (Special)
  { index: 18, top: 25, left: 25, isLarge: true, card: { name: "PARTY HOUSE", image: generatedIllustrationPartyHouse, color: "#A96D4E" } },
  // 19: JAPAN (Blue)
  { index: 19, top: 288, left: 25, isSide: true, card: { name: "JAPAN", image: generatedIllustrationJapan, color: "#619CCC", value: "$2500" } },
  // 20: USA (Yellow)
  { index: 20, top: 417, left: 25, isSide: true, card: { name: "USA", image: generatedIllustrationUsa, color: "#EDB64D", value: "$8500" } },
  // 21: TRAVELLING DUTY (Special)
  { index: 21, top: 547, left: 25, isSide: true, card: { name: "TRAVELLING DUTY", image: generatedIllustrationTravellingDuty, color: "#74699C", fontSize: "text-base", imageClass: "w-60" } },
  // 22: ROADWAYS (Utility)
  { index: 22, top: 676, left: 25, isSide: true, card: { name: "ROADWAYS", image: generatedIllustrationRoadways, color: "#A8B7C9", value: "$3500" } },
  // 23: MEXICO (Yellow)
  { index: 23, top: 806, left: 25, isSide: true, card: { name: "MEXICO", image: generatedIllustrationMexico, color: "#EDB64D", value: "$4000" } },
  // 24: HONGKONG (Blue)
  { index: 24, top: 935, left: 25, isSide: true, card: { name: "HONGKONG", image: generatedIllustrationHongkong, color: "#619CCC", value: "$2000" } },
  // 25: UNO (Special)
  { index: 25, top: 1064, left: 25, isSide: true, card: { name: "UNO", image: image, color: "#326BA8", value: "UNITED NATIONS", fontSize: "text-[11.2px]" } },
  // 26: AUSTRALIA (Yellow)
  { index: 26, top: 1194, left: 25, isSide: true, card: { name: "AUSTRALIA", image: generatedIllustrationAustralia, color: "#EDB64D", value: "$3300", fontSize: "text-[19px]" } },
  // 27: JAIL (Special)
  { index: 27, top: 1323, left: 25, isLarge: true, card: { name: "JAIL", image: generatedIllustrationJail, color: "#788D9E" } },
  // 28: INDIA (Blue)
  { index: 28, top: 1323, left: 288, card: { name: "INDIA", image: generatedIllustrationIndia, color: "#619CCC", value: "$4500" } },
  // 29: CHANCE (Special)
  { index: 29, top: 1323, left: 417, card: { name: "CHANCE", image: generatedIllustrationChance2, color: "#EDB64D", imageClass: "h-[196px]" } },
  // 30: SAUDI ARABIA (Green)
  { index: 30, top: 1323, left: 547, card: { name: "SAUDI ARABIA", image: generatedIllustrationSaudiArabia, color: "#91B65A", value: "$5500", fontSize: "text-xs" } },
  // 31: PETROLEUM (Utility)
  { index: 31, top: 1323, left: 676, card: { name: "PETROLEUM", image: generatedIllustrationPetroleum, color: "#A8B7C9", value: "$5500", fontSize: "text-[13.5px]" } },
  // 32: CHINA (Blue)
  { index: 32, top: 1323, left: 806, card: { name: "CHINA", image: generatedIllustrationChina, color: "#619CCC", value: "$4500" } },
  // 33: RAILWAYS (Utility)
  { index: 33, top: 1323, left: 935, card: { name: "RAILWAYS", image: generatedIllustrationRailways, color: "#A8B7C9", value: "$9500", fontSize: "text-[15px]" } },
  // 34: MALAYSIA (Green)
  { index: 34, top: 1323, left: 1064, card: { name: "MALAYSIA", image: generatedIllustrationMalaysia, color: "#91B65A", value: "$1500", fontSize: "text-[15px]" } },
  // 35: SINGAPORE (Blue)
  { index: 35, top: 1323, left: 1194, card: { name: "SINGAPORE", image: generatedIllustrationSingapore, color: "#619CCC", value: "$3000", fontSize: "text-[13.5px]" } }
];

interface BoardProps {
  spacesState: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>;
  players: Player[];
  activePlayer?: Player;
  onTileClick: (space: BoardSpace) => void;
}

export const Board: React.FC<BoardProps> = ({
  spacesState,
  players,
  onTileClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const dimension = width > 0 && height > 0 ? Math.min(width, height) : width || 360;
        setScale(dimension / 1600);
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full max-w-[min(calc(100vw-16px),calc(100dvh-260px),840px)] max-h-[min(calc(100vw-16px),calc(100dvh-260px),840px)] aspect-square mx-auto rounded-[20px] sm:rounded-[32px] overflow-hidden select-none shadow-[0_12px_40px_rgba(0,0,0,0.6)] border-3 sm:border-4 border-white/60 bg-[#6fafcd]"
    >
      {/* 1600x1600 Canvas Scaled to Fit Responsive Container */}
      <div
        className="w-[1600px] h-[1600px] absolute top-0 left-0 bg-[#6fafcd]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Soft Inset Board Inner Border */}
        <div className="absolute top-3.5 left-3.5 w-[1572px] h-[1572px] bg-[#b7ddeb] rounded-[31px] shadow-[inset_-3px_-4px_15px_#ffffffec,inset_4px_6px_18px_#46789948]" />

        {/* ── Render 36 Spaces with Figma Clay Aesthetics & Game Overlays ── */}
        {SPACES_CONFIG.map((config) => {
          const space = BOARD_SPACES[config.index];
          const state = spacesState[config.index];
          const owner = state?.ownerId !== undefined ? players.find((p) => p.id === state.ownerId) : undefined;
          const occupyingPlayers = players.filter((p) => p.boardPosition === config.index && !p.isBankrupt);

          const overlayContent = (
            <>
              {/* Ownership Color Ribbon */}
              {owner && (
                <div
                  className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-full text-[11px] font-game font-bold text-white shadow-md border border-white/40"
                  style={{ backgroundColor: owner.color }}
                >
                  {owner.name.slice(0, 4)}
                </div>
              )}

              {/* Houses / Hotels */}
              {state?.hasHotel && (
                <div className="absolute top-1 left-1.5 z-10 text-2xl filter drop-shadow">🏨</div>
              )}
              {state?.housesCount > 0 && !state?.hasHotel && (
                <div className="absolute top-1 left-1.5 z-10 flex gap-0.5 text-lg filter drop-shadow">
                  {Array.from({ length: state.housesCount }).map((_, i) => (
                    <span key={i}>🏠</span>
                  ))}
                </div>
              )}

              {/* Mortgaged Veil */}
              {state?.isMortgaged && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-15 rounded-[14px]">
                  <span className="bg-red-600 text-white font-game font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border border-white/30 tracking-wider">
                    MORTGAGED
                  </span>
                </div>
              )}

              {/* Active Player Pawns */}
              {occupyingPlayers.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="flex -space-x-3 items-center justify-center filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
                    {occupyingPlayers.map((p) => (
                      <div
                        key={p.id}
                        className="w-11 h-11 rounded-full border-2 border-white shadow-xl flex items-center justify-center font-display text-white text-base font-bold animate-[bounce-soft_1s_ease-in-out_infinite]"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          );

          if (config.isSide) {
            return (
              <SideCard
                key={`space-${config.index}`}
                card={{
                  ...config.card,
                  top: config.top,
                  left: config.left,
                }}
                onClick={() => onTileClick(space)}
              >
                {overlayContent}
              </SideCard>
            );
          }

          return (
            <Card
              key={`space-${config.index}`}
              style={{
                position: 'absolute',
                top: config.top,
                left: config.left,
              }}
              card={config.card}
              large={config.isLarge}
              onClick={() => onTileClick(space)}
            >
              {overlayContent}
            </Card>
          );
        })}

        {/* ── Center 980x980 Clay Rule Console (Directly from Figma) ── */}
        <section
          className="absolute top-[310px] left-[310px] w-[980px] h-[980px] bg-[#ecf8fc] rounded-[28px] overflow-hidden border-[3px] border-solid border-white shadow-[0px_7px_12px_#305a7c31,inset_-2px_-2px_5px_#ffffffe8]"
          aria-labelledby="international-business-title"
        >
          <div className="absolute top-2.5 left-2.5 w-[960px] h-[960px] bg-[#eaf5f9] rounded-3xl shadow-[inset_3px_4px_11px_#5f92a62a,inset_-2px_-2px_6px_#ffffffc7]" />
          
          <h1
            id="international-business-title"
            className="absolute top-6 left-6 w-[932px] h-[95px] rounded-[18px] bg-[#1b4161] shadow-[0px_7px_10px_#2750725a,inset_-1px_-2px_5px_#ffffff28] px-[52px] flex items-center [font-family:'Fredoka-Bold',Helvetica] font-bold text-white text-[45px] tracking-wide"
          >
            INTERNATIONAL BUSINESS
          </h1>

          {rules.map((rule, index) => (
            <article
              key={`${rule.title}-${rule.subtitle}`}
              className={`absolute ${index < 2 ? "top-[141px]" : "top-[566px]"} ${
                index % 2 === 0 ? "left-6" : "left-[498px]"
              } w-[458px] h-[352px] bg-[#f9fcff] rounded-[18px] overflow-hidden border-2 border-solid border-white shadow-[0px_7px_10px_#2c58722e,inset_-2px_-2px_5px_#ffffffd9]`}
            >
              <header
                className="absolute top-0 left-0 w-[458px] h-12 rounded-xl px-4 flex items-center text-white shadow-sm"
                style={{ backgroundColor: rule.color }}
              >
                <strong className="[font-family:'Fredoka-Bold',Helvetica] text-[23px]">
                  {rule.title}
                </strong>
                <span className="ml-4 [font-family:'Fredoka-Medium',Helvetica] text-[13.5px] opacity-90">
                  {rule.subtitle}
                </span>
              </header>
              <div className="absolute top-[51px] left-[15px] w-[428px] h-0.5 bg-[#b0d8e3]" />
              <p className="absolute top-[61px] left-4 w-[424px] h-[277px] [font-family:'Outfit-Medium',Helvetica] font-medium text-[#173b55] text-[18px] leading-[26px]">
                {rule.text.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};
