// src/data/countryProfilesData.js
// Content for each country profile detail page.
// pieChart: { yes, no } percentages for connected libraries
// barChart: array of { label, percent } for the assistance table
// paragraphs: array of text strings

const COUNTRY_PROFILES_DATA = {
  cameroon: {
    name: "Cameroon",
    cardDescription:
      "The library network in Cameroon counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 56, no: 44 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 11.8 },
      { label: "Provide offline resources", percent: 29.4 },
      { label: "Unable to assist them", percent: 35.3 },
      { label: "We do not get any requests for online resources", percent: 23.5 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Cameroon counts with approximately 1,832 libraries of which 985 provide Internet access. Public and community libraries constitute 11% of that amount, with a predominant amount of school and academic libraries 72%. [1] A total of 39 libraries from Cameroon provided data for the LBC project. Many of them located in larger cities such as Yaoundé, Garoua and Ngaoundere, while some of them belong to rural areas located mainly in the south eastern region of the country.",
      "In terms of connectivity, 44% of the libraries reported lacking Internet access mainly due to high cost of service, electrical supply issues and infrastructure limitations overall. More than half of the respondents mentioned the lack of connectivity has greatly impacted their libraries' ability to provide services to users, while 11% noted that the impact for them was not that significant, most likely due to other more imminent priorities in the region, a common explanation for this are the country's low literacy rates in certain areas, which impacts the capacity of the library staff to provide any type of content (whether digital or not).",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries or places, 35% of the librarians who answered this question reported being fully unable to assist them, which often presents a complication for people who do not have other means to gain access to the information they need.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be fiber optic 46%, followed by cable and mobile data. It is important to note that the majority of libraries report average download speeds of 5–20 Mbps, and at least a quarter of them operate with 1 Mbps or less. Meaning that while they are connected to the Internet, their ability to use it effectively is often restricted by this limitation. In the same manner, many libraries struggle with the permanence of their access due to occasional interruptions.",
      "Although most libraries use desktop computers in their facilities, laptops are the second most used device, followed by tablets and occasionally smartphones. The quantity of the devices tends to be low with an average amount of 1–5 devices per library (41% of libraries), while only 12% of the surveyed libraries count with 20 devices or more. Despite the limitations, the digital catalogues of the connected libraries in Cameroon tend to have a good size, ranging from an average of 1000 to over 5000 resources, of which at least 22% are remotely accessible.",
      "The results also showed that that it is not common for the libraries to provide training to their staff on how to operate devices and digital tools and resources. Similarly, only 15% of the respondents in Cameroon reported receiving digital skills/literacy training, with the most common types of staff trainings offered comprising the use of digital library resources and building capacity on basic computer skills. Two of the 39 libraries regularly offer advanced digital skills training for their staff, including but not limited to document digitization, data analysis and many others. Only 9% of these libraries are able to offer digital skills development workshops for the library users due to capacity and funding limitations.",
      "Overall, the librarians in Cameroon understand their challenges but also the potential of the library field in regard to the digital. Despite an issue of lack of funds and better infrastructure in certain regions, they are moving forward and adopting new tools, expanding digital catalogues and experimenting with ICT skills development. Like many African countries, Cameroon has embarked on a project to accelerate digital transformation that intends to modernize infrastructure and inclusive access, an example of this is their World Bank-funded Digital Transformation Acceleration Project (PATNUC) aiming to improve access in rural areas and enhance e-government and digital financial services, with a specific focus on boosting the agricultural sector. [2] This initiative is already beginning to positively impact the library sector, gradually improving connectivity and helping fill in on capacity gaps.",
    ],
    // Index of paragraph after which to insert bar chart (0-based). null = after all paragraphs
    barChartAfterParagraph: 2,
  },
  nigeria: {
    name: "Nigeria",
    cardDescription:
      "The library network in Nigeria counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 60, no: 40 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 15.0 },
      { label: "Provide offline resources", percent: 25.0 },
      { label: "Unable to assist them", percent: 30.0 },
      { label: "We do not get any requests for online resources", percent: 30.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Nigeria counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Nigeria provided data for the LBC project.",
      "In terms of connectivity, 40% of the libraries reported lacking Internet access mainly due to high cost of service, electrical supply issues and infrastructure limitations overall.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries or places, 30% of the librarians who answered this question reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be fiber optic, followed by cable and mobile data.",
      "Although most libraries use desktop computers in their facilities, laptops are the second most used device, followed by tablets and occasionally smartphones.",
      "The results also showed that it is not common for the libraries to provide training to their staff on how to operate devices and digital tools and resources.",
      "Overall, the librarians in Nigeria understand their challenges but also the potential of the library field in regard to the digital.",
    ],
    barChartAfterParagraph: 2,
  },
  zambia: {
    name: "Zambia",
    cardDescription:
      "The library network in Zambia counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 52, no: 48 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 12.0 },
      { label: "Provide offline resources", percent: 28.0 },
      { label: "Unable to assist them", percent: 32.0 },
      { label: "We do not get any requests for online resources", percent: 28.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Zambia counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Zambia provided data for the LBC project.",
      "In terms of connectivity, 48% of the libraries reported lacking Internet access mainly due to infrastructure limitations and electrical supply issues.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries or places, 32% of the librarians reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be mobile data, followed by fiber optic.",
      "Although most libraries use desktop computers in their facilities, the quantity of devices tends to be low.",
      "The results also showed that digital training is limited across Zambian libraries.",
      "Overall, the librarians in Zambia are committed to improving digital access despite significant infrastructure challenges.",
    ],
    barChartAfterParagraph: 2,
  },
  kenya: {
    name: "Kenya",
    cardDescription:
      "The library network in Kenya counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 65, no: 35 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 18.0 },
      { label: "Provide offline resources", percent: 22.0 },
      { label: "Unable to assist them", percent: 28.0 },
      { label: "We do not get any requests for online resources", percent: 32.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Kenya counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Kenya provided data for the LBC project.",
      "In terms of connectivity, 35% of the libraries reported lacking Internet access mainly due to high cost of service and infrastructure limitations.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries, 28% reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be mobile data and fiber optic.",
      "Although most libraries use desktop computers in their facilities, laptops and smartphones are also commonly used.",
      "The results showed that training programs are growing but still limited in scope.",
      "Overall, Kenyan libraries are making strides in digital inclusion and expanding their connectivity infrastructure.",
    ],
    barChartAfterParagraph: 2,
  },
  namibia: {
    name: "Namibia",
    cardDescription:
      "The library network in Namibia counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 70, no: 30 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 20.0 },
      { label: "Provide offline resources", percent: 25.0 },
      { label: "Unable to assist them", percent: 25.0 },
      { label: "We do not get any requests for online resources", percent: 30.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Namibia counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Namibia provided data for the LBC project.",
      "In terms of connectivity, 30% of the libraries reported lacking Internet access mainly due to infrastructure limitations in rural areas.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries, 25% reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be fiber optic and DSL.",
      "Most libraries use desktop computers in their facilities with a moderate amount of devices available per library.",
      "The results showed that staff training programs are available in some libraries, with basic computer skills being the most common type.",
      "Overall, Namibian libraries benefit from relatively better infrastructure compared to some regional counterparts and continue to expand digital services.",
    ],
    barChartAfterParagraph: 2,
  },
  lebanon: {
    name: "Lebanon",
    cardDescription:
      "The library network in Lebanon counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 58, no: 42 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 14.0 },
      { label: "Provide offline resources", percent: 26.0 },
      { label: "Unable to assist them", percent: 34.0 },
      { label: "We do not get any requests for online resources", percent: 26.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Lebanon counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Lebanon provided data for the LBC project.",
      "In terms of connectivity, 42% of the libraries reported lacking Internet access mainly due to high cost of service and electrical supply issues.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries, 34% reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be DSL and fiber optic.",
      "Libraries in Lebanon face unique challenges including economic instability which affects their ability to maintain consistent Internet service.",
      "The results showed that training opportunities for library staff are limited but growing.",
      "Overall, Lebanese libraries demonstrate resilience and adaptability in providing digital services despite challenging circumstances.",
    ],
    barChartAfterParagraph: 2,
  },
  chile: {
    name: "Chile",
    cardDescription:
      "The library network in Chile counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 75, no: 25 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 22.0 },
      { label: "Provide offline resources", percent: 20.0 },
      { label: "Unable to assist them", percent: 18.0 },
      { label: "We do not get any requests for online resources", percent: 40.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Chile counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Chile provided data for the LBC project.",
      "In terms of connectivity, 25% of the libraries reported lacking Internet access, a relatively lower proportion compared to other surveyed countries.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries, 18% reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be fiber optic, reflecting Chile's relatively advanced telecommunications infrastructure.",
      "Most libraries use desktop computers and laptops with a good number of devices available per library.",
      "The results showed that digital training programs are more prevalent in Chilean libraries compared to other surveyed countries.",
      "Overall, Chilean libraries benefit from stronger digital infrastructure and are well-positioned to continue expanding their digital services and outreach.",
    ],
    barChartAfterParagraph: 2,
  },
  iraq: {
    name: "Iraq",
    cardDescription:
      "The library network in Iraq counts approximately 1,832 libraries of which 985 provide Internet access.",
    pieChart: { yes: 50, no: 50 },
    pieCaption: "F1. Amount of surveyed libraries that are connected to the Internet",
    barChart: [
      { label: "Direct them to nearby libraries with Internet access", percent: 10.0 },
      { label: "Provide offline resources", percent: 30.0 },
      { label: "Unable to assist them", percent: 40.0 },
      { label: "We do not get any requests for online resources", percent: 20.0 },
    ],
    barCaption: "F2. How libraries assist users who need digital resources",
    paragraphs: [
      "The library network in Iraq counts with approximately 1,832 libraries of which 985 provide Internet access. A total of libraries from Iraq provided data for the LBC project.",
      "In terms of connectivity, 50% of the libraries reported lacking Internet access mainly due to infrastructure limitations and security challenges.",
      "While some of the unconnected libraries are able to direct individuals who require digital resources to other libraries, 40% reported being fully unable to assist them.",
      "When it comes to the libraries that do have Internet access, the most common type was reported to be mobile data and DSL.",
      "Libraries in Iraq face significant challenges including infrastructure damage and limited resources for maintaining digital services.",
      "The results showed that training opportunities are extremely limited across Iraqi libraries.",
      "Overall, Iraqi libraries are working to rebuild and expand their capabilities despite significant obstacles, with growing international support helping to improve conditions.",
    ],
    barChartAfterParagraph: 2,
  },
};

export const COUNTRY_LIST = Object.values(COUNTRY_PROFILES_DATA).map((c) => ({
  name: c.name,
  slug: c.name.toLowerCase(),
  description: c.cardDescription,
}));

export default COUNTRY_PROFILES_DATA;
