import React from "react";
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

export type BoardCard = {
  name: string;
  image: string;
  color: string;
  value?: string;
  fontSize?: string;
  imageClass?: string;
};

export const shadow =
  "shadow-[0px_5px_12px_#1b416329,-2px_-2px_6px_#ffffffdf,inset_0px_1px_0px_#ffffff]";

export const verticalCards: BoardCard[] = [
  {
    name: "ITALY",
    image: generatedIllustrationItaly,
    color: "#D97681",
    value: "$3500",
  },
  {
    name: "CHANCE",
    image: generatedIllustrationChance,
    color: "#D49A45",
    imageClass: "h-[196px]",
  },
  {
    name: "BRAZIL",
    image: generatedIllustrationBrazil,
    color: "#E2B64D",
    value: "$2500",
  },
  {
    name: "SWITZERLAND",
    image: generatedIllustrationSwitzerland,
    color: "#D97681",
    value: "$3500",
    fontSize: "text-xs",
  },
  {
    name: "PETROLEUM",
    image: generatedIllustrationPetroleum,
    color: "#A3AFC2",
    value: "$5500",
    fontSize: "text-[13.5px]",
  },
  {
    name: "CUSTOM DUTY",
    image: generatedIllustrationCustomDuty,
    color: "#9781A6",
    value: "ON ITEMS",
    fontSize: "text-xs",
  },
  {
    name: "AIRWAYS",
    image: generatedIllustrationAirways,
    color: "#A3AFC2",
    value: "$10500",
    fontSize: "text-[15px]",
  },
  {
    name: "GERMANY",
    image: generatedIllustrationGermany,
    color: "#D97681",
    value: "$3500",
    fontSize: "text-[15px]",
  },
  {
    name: "CANADA",
    image: generatedIllustrationCanada,
    color: "#E2B64D",
    value: "$4000",
  },
  {
    name: "INDIA",
    image: generatedIllustrationIndia,
    color: "#63A2CF",
    value: "$4500",
  },
  {
    name: "CHANCE",
    image: generatedIllustrationChance2,
    color: "#D49A45",
    imageClass: "h-[196px]",
  },
  {
    name: "SAUDI ARABIA",
    image: generatedIllustrationSaudiArabia,
    color: "#89B46C",
    value: "$5500",
    fontSize: "text-xs",
  },
  {
    name: "PETROLEUM",
    image: generatedIllustrationPetroleum,
    color: "#A3AFC2",
    value: "$5500",
    fontSize: "text-[13.5px]",
  },
  {
    name: "CHINA",
    image: generatedIllustrationChina,
    color: "#63A2CF",
    value: "$4500",
  },
  {
    name: "RAILWAYS",
    image: generatedIllustrationRailways,
    color: "#A3AFC2",
    value: "$9500",
    fontSize: "text-[15px]",
  },
  {
    name: "MALAYSIA",
    image: generatedIllustrationMalaysia,
    color: "#89B46C",
    value: "$1500",
    fontSize: "text-[15px]",
  },
  {
    name: "SINGAPORE",
    image: generatedIllustrationSingapore,
    color: "#63A2CF",
    value: "$3000",
    fontSize: "text-[13.5px]",
  },
];

export const sideCards: Array<BoardCard & { top: number; left: number }> = [
  {
    name: "JAPAN",
    image: generatedIllustrationJapan,
    color: "#63A2CF",
    value: "$2500",
    top: 288,
    left: 25,
  },
  {
    name: "EGYPT",
    image: generatedIllustrationEgypt,
    color: "#89B46C",
    value: "$3200",
    top: 288,
    left: 1323,
  },
  {
    name: "USA",
    image: generatedIllustrationUsa,
    color: "#E2B64D",
    value: "$8500",
    top: 417,
    left: 25,
  },
  {
    name: "SATELLITE",
    image: generatedIllustrationSatellite,
    color: "#A3AFC2",
    value: "$2000",
    fontSize: "text-[19px]",
    top: 417,
    left: 1323,
  },
  {
    name: "TRAVELLING DUTY",
    image: generatedIllustrationTravellingDuty,
    color: "#9781A6",
    top: 547,
    left: 25,
    fontSize: "text-base",
    imageClass: "w-60",
  },
  {
    name: "IRAN",
    image: generatedIllustrationIran,
    color: "#89B46C",
    value: "$2500",
    top: 547,
    left: 1323,
  },
  {
    name: "ROADWAYS",
    image: generatedIllustrationRoadways,
    color: "#A3AFC2",
    value: "$3500",
    top: 676,
    left: 25,
  },
  {
    name: "FRANCE",
    image: generatedIllustrationFrance,
    color: "#D97681",
    value: "$2500",
    top: 676,
    left: 1323,
  },
  {
    name: "MEXICO",
    image: generatedIllustrationMexico,
    color: "#E2B64D",
    value: "$4000",
    top: 806,
    left: 25,
  },
  {
    name: "UNO",
    image: generatedIllustrationUno,
    color: "#317DB0",
    value: "UNITED NATIONS",
    fontSize: "text-[11.2px]",
    top: 806,
    left: 1323,
  },
  {
    name: "HONGKONG",
    image: generatedIllustrationHongkong,
    color: "#63A2CF",
    value: "$2000",
    top: 935,
    left: 25,
  },
  {
    name: "WATERWAYS",
    image: generatedIllustrationWaterways,
    color: "#A3AFC2",
    value: "$9500",
    fontSize: "text-[19px]",
    top: 935,
    left: 1323,
  },
  {
    name: "UNO",
    image,
    color: "#317DB0",
    value: "UNITED NATIONS",
    fontSize: "text-[11.2px]",
    top: 1064,
    left: 25,
  },
  {
    name: "IRAQ",
    image: generatedIllustrationIraq,
    color: "#89B46C",
    value: "$2500",
    top: 1064,
    left: 1323,
  },
  {
    name: "AUSTRALIA",
    image: generatedIllustrationAustralia,
    color: "#E2B64D",
    value: "$3300",
    fontSize: "text-[19px]",
    top: 1194,
    left: 25,
  },
  {
    name: "ENGLAND",
    image: generatedIllustrationEngland,
    color: "#D97681",
    value: "$2500",
    top: 1194,
    left: 1323,
  },
];

export const rules = [
  {
    title: "UNO",
    subtitle: "ODD ROLL • PAY",
    color: "#317DB0",
    text: [
      "When you arrive on the site of UNO",
      "by an odd number (Such as 3,5,7)",
      "pay to the bank as follows",
      "3. Go to Jail",
      "5. School and Medical Fees $2500",
      "7. Submit your Passport",
      "9. Make General Repair on all your properties",
      "   for each House $50 for each Hotel $100",
      "11. Pay Insurance premium $1500",
    ],
  },
  {
    title: "UNO",
    subtitle: "EVEN ROLL • COLLECT",
    color: "#317DB0",
    text: [
      "When you arrive on the site of UNO",
      "by an even number (Such as 2,4,6)",
      "receive from the bank as follows",
      "2. It is your Anniversary collect from each player $500",
      "4. 1st prize in Beauty contest $2500",
      "6. Income tax refund $2000",
      "8. Go to party House & collect from each player $200",
      "10. Receive interest on shares $1500",
      "12. Sale of stocks collect $3000",
    ],
  },
  {
    title: "CHANCE",
    subtitle: "EVEN ROLL • PAY",
    color: "#D49A45",
    text: [
      "When you arrive on the site of CHANCE",
      "by an even number (Such as 2,4,6)",
      "pay to the bank as follows",
      "2. Loss in Share market $2000",
      "4. Fine for Accident due to Wrong Driving $1000",
      "6. House repair $1500",
      "8. Loss due to fire in godown $3000",
      "10. Go to Jail",
      "12. Repair of your Car $200",
    ],
  },
  {
    title: "CHANCE",
    subtitle: "ODD ROLL • COLLECT",
    color: "#D49A45",
    text: [
      "When you arrive on the site of CHANCE",
      "by an odd number (Such as 3,5,7)",
      "receive from the bank as follows",
      "3. Lottery prize $2500",
      "5. You have won cross word prize $1000",
      "7. Collect rent from each player",
      "   for all of your sites $100",
      "9. You have won Jackpot of $2000",
      "11. Prize for best performance in Export $1500",
    ],
  },
];

export const Card = ({
  card,
  large = false,
  style,
  children,
  onClick,
}: {
  card: BoardCard;
  large?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}) => (
  <article
    onClick={onClick}
    style={style}
    className={`${
      large ? "w-[252px] h-[252px] rounded-[20px]" : "w-[118px] h-[252px] rounded-[14px]"
    } absolute bg-white overflow-hidden border border-white/90 ${shadow} ${
      onClick ? "cursor-pointer hover:brightness-105 transition-all" : ""
    }`}
    aria-label={card.name}
  >
    <img
      className={`absolute ${
        large ? "top-14 left-[7px] w-[238px] h-[187px]" : "top-[49px] left-1.5 w-[106px] h-[157px]"
      } object-cover ${card.imageClass || ""}`}
      alt={card.name}
      src={card.image}
    />
    <div
      className={`absolute ${
        large
          ? "top-[7px] left-[7px] w-[238px] h-[46px] rounded-[11px]"
          : "top-[5px] left-[5px] w-[108px] h-10 rounded-[7px]"
      } shadow-[0px_3px_5px_#142d4334,inset_0px_-1px_3px_#ffffff50]`}
      style={{ backgroundColor: card.color }}
    />
    <div
      className={`absolute bg-[#D69C49] opacity-[0.92] ${
        large ? "top-[53px] left-[7px] w-[238px] h-[3px]" : "top-11 left-[5px] w-[108px] h-0.5"
      }`}
    />
    <div
      className={`absolute flex items-center justify-center [font-family:'Fredoka',Helvetica] font-semibold text-white text-center tracking-[0] leading-[normal] ${
        large
          ? "top-[9px] left-3 w-[228px] h-[41px] text-[28px]"
          : `top-2 left-[7px] w-[104px] h-[33px] ${card.fontSize || "text-[17px]"}`
      }`}
    >
      {card.name}
    </div>
    {card.value && (
      <>
        <div
          className={`absolute bg-[#FFF9EE] border border-solid border-[#F0DAB6] shadow-[0px_2px_4px_#35516c1a,inset_-1px_-1px_2px_#ffffff] ${
            large
              ? "top-52 left-[7px] w-[238px] h-[39px] rounded-[10px]"
              : "top-52 left-[5px] w-[108px] h-[39px] rounded-[7px]"
          }`}
        />
        <div
          className={`absolute flex items-center justify-center [font-family:'Fredoka',Helvetica] font-semibold text-[#163650] text-center tracking-[0] leading-[normal] ${
            large
              ? "top-52 left-[11px] w-[230px] h-[42px] text-[19px]"
              : `top-[209px] left-2 w-[102px] h-[37px] ${
                  card.value === "UNITED NATIONS" ? "text-[11.2px]" : "text-[17px]"
                }`
          }`}
        >
          {card.value}
        </div>
      </>
    )}
    {children}
  </article>
);

export const SideCard = ({
  card,
  children,
  onClick,
}: {
  card: BoardCard & { top: number; left: number };
  children?: React.ReactNode;
  onClick?: () => void;
}) => (
  <article
    onClick={onClick}
    className={`absolute w-[252px] h-[118px] rounded-[14px] bg-white overflow-hidden border border-white/90 ${shadow} ${
      onClick ? "cursor-pointer hover:brightness-105 transition-all" : ""
    }`}
    style={{ top: card.top, left: card.left }}
    aria-label={card.name}
  >
    <img
      className={`absolute top-[41px] left-1.5 w-[147px] h-[71px] object-cover ${card.imageClass || ""}`}
      alt={card.name}
      src={card.image}
    />
    <div
      className="absolute top-[5px] left-[5px] w-[242px] h-[34px] rounded-[11px] shadow-[0px_3px_5px_#142d4334,inset_0px_-1px_3px_#ffffff50]"
      style={{ backgroundColor: card.color }}
    />
    <div className="absolute top-[38px] left-[5px] w-[242px] h-0.5 bg-[#D69C49] opacity-[0.92]" />
    <div
      className={`absolute top-[7px] left-[9px] w-[234px] h-[30px] flex items-center justify-center [font-family:'Fredoka',Helvetica] font-semibold text-white text-center tracking-[0] leading-[normal] ${
        card.fontSize || "text-[22px]"
      }`}
    >
      {card.name}
    </div>
    {card.value && (
      <>
        <div className="absolute top-[41px] left-[154px] w-[93px] h-[71px] bg-[#FFF9EE] rounded-[10px] border border-solid border-[#F0DAB6] shadow-[0px_2px_4px_#35516c1a,inset_-1px_-1px_2px_#ffffff]" />
        <div
          className={`absolute top-[43px] left-[157px] w-[87px] h-[67px] flex items-center justify-center [font-family:'Fredoka',Helvetica] font-semibold text-[#163650] text-center tracking-[0] leading-[normal] ${
            card.value === "UNITED NATIONS" ? "text-[11.2px]" : "text-[16.5px]"
          }`}
        >
          {card.value}
        </div>
      </>
    )}
    {children}
  </article>
);

export const International = (): JSX.Element => {
  return (
    <main className="bg-[#DCEEF4] w-full min-w-[1600px] min-h-[1600px] relative">
      <div className="absolute top-3.5 left-3.5 w-[1572px] h-[1572px] bg-[#E9F5F8] rounded-[31px] shadow-[inset_-3px_-4px_15px_#ffffffec,inset_4px_6px_18px_#1b416315]" />
      
      {/* 4 Corners with exact placement */}
      <Card
        style={{ top: 25, left: 25 }}
        card={{
          name: "PARTY HOUSE",
          image: generatedIllustrationPartyHouse,
          color: "#B58567",
        }}
        large
      />
      <Card
        style={{ top: 25, left: 1323 }}
        card={{
          name: "RESORT",
          image: generatedIllustrationResort,
          color: "#329E91",
        }}
        large
      />
      <Card
        style={{ top: 1323, left: 25 }}
        card={{
          name: "JAIL",
          image: generatedIllustrationJail,
          color: "#697788",
        }}
        large
      />
      <Card
        style={{ top: 1323, left: 1323 }}
        card={{
          name: "START",
          image: generatedIllustrationStart,
          color: "#D86A75",
          value: "COLLECT $1500",
        }}
        large
      />

      {/* Top and Bottom Vertical Cards */}
      {verticalCards.map((card, index) => (
        <div
          key={`${card.name}-${index}`}
          style={{
            position: "absolute",
            top: index % 2 === 0 ? 25 : 1323,
            left: [288, 417, 547, 676, 806, 935, 1064, 1194][
              Math.floor(index / 2)
            ],
          }}
        >
          <Card card={card} />
        </div>
      ))}

      {/* Side Cards */}
      {sideCards.map((card) => (
        <SideCard key={`${card.name}-${card.top}-${card.left}`} card={card} />
      ))}

      {/* Center Console with Rules */}
      <section
        className="absolute top-[310px] left-[310px] w-[980px] h-[980px] bg-[#ecf8fc] rounded-[28px] overflow-hidden border-[3px] border-solid border-white shadow-[0px_7px_12px_#305a7c31,inset_-2px_-2px_5px_#ffffffe8]"
        aria-labelledby="international-business-title"
      >
        <div className="absolute top-2.5 left-2.5 w-[960px] h-[960px] bg-[#eaf5f9] rounded-3xl shadow-[inset_3px_4px_11px_#5f92a62a,inset_-2px_-2px_6px_#ffffffc7]" />
        <h1
          id="international-business-title"
          className="absolute top-6 left-6 w-[932px] h-[95px] rounded-[18px] bg-[#1b4161] shadow-[0px_7px_10px_#2750725a,inset_-1px_-2px_5px_#ffffff28] px-[52px] flex items-center [font-family:'Fredoka-Bold',Helvetica] font-bold text-white text-[45px]"
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
              className="absolute top-0 left-0 w-[458px] h-12 rounded-xl px-4 flex items-center text-white"
              style={{ backgroundColor: rule.color }}
            >
              <strong className="[font-family:'Fredoka-Bold',Helvetica] text-[23px]">
                {rule.title}
              </strong>
              <span className="ml-4 [font-family:'Fredoka-Medium',Helvetica] text-[13.5px]">
                {rule.subtitle}
              </span>
            </header>
            <div className="absolute top-[51px] left-[15px] w-[428px] h-0.5 bg-[#b0d8e3]" />
            <p className="absolute top-[61px] left-4 w-[424px] h-[277px] [font-family:'Outfit-Medium',Helvetica] font-medium text-[#173b55] text-xl leading-[normal]">
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
    </main>
  );
};
