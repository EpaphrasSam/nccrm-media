import { EventWithDetails } from "./types";

export const mockDetailedEvents: EventWithDetails[] = [
  {
    id: "evt_1",
    reporterId: "1",
    subIndicatorId: "1",
    regionId: "1",
    thematicAreaId: "1",
    date: "2024-01-15",
    createdAt: "2024-01-15",

    // Event details
    eventDetails: "Armed robbery at a local bank",
    when: "2024-01-15",
    where: "Greater Accra",
    locationDetails: "Main Street, near the central market",
    what: "1",
    thematicArea: "Crime & Justice",

    // Perpetrator details
    perpetrator: {
      name: "Unknown Armed Group",
      age: "26-35",
      gender: "male",
      occupation: "Unknown",
      organization: "Local Gang",
      note: "Group of 4-5 armed individuals",
    },

    // Victim details
    victim: {
      name: "Bank Staff and Customers",
      age: "25-45",
      gender: "female",
      occupation: "Various",
      organization: "Local Bank",
      note: "Multiple victims including staff and customers",
    },

    // Outcome details
    outcome: {
      deathsMen: 0,
      deathsWomenChildren: 0,
      deathDetails: "No fatalities reported",
      injuriesMen: 2,
      injuriesWomenChildren: 1,
      injuriesDetails: "Minor injuries from physical assault",
      lossesProperty: 50000,
      lossesDetails: "Cash and valuables stolen from vault",
    },

    // Context details
    context: {
      informationCredibility: "high",
      informationSource: "Police Report",
      geographicScope: "Local",
      impact: "high",
      weaponsUse: "Firearms",
      details: "Professional operation indicating organized crime",
    },

    // UI display properties
    reporter: "Sarah Ibrahim",
    subIndicator: "Armed Robbery Cases",
    region: "Greater Accra",
  },
  {
    id: "evt_2",
    reporterId: "2",
    subIndicatorId: "2",
    regionId: "2",
    thematicAreaId: "2",
    date: "2024-02-05",
    createdAt: "2024-02-05",

    // Event details
    eventDetails: "Election violence at polling station",
    when: "2024-02-05",
    where: "Ashanti Region",
    locationDetails: "Central polling station in Kumasi",
    what: "2",
    thematicArea: "Electoral Violence",

    // Perpetrator details
    perpetrator: {
      name: "Political Party Supporters",
      age: "18-45",
      gender: "male",
      occupation: "Various",
      organization: "Political Party A",
      note: "Group of party supporters",
    },

    // Victim details
    victim: {
      name: "Voters and Electoral Officials",
      age: "18-65",
      gender: "female",
      occupation: "Various",
      organization: "Electoral Commission",
      note: "Multiple voters and electoral officials affected",
    },

    // Outcome details
    outcome: {
      deathsMen: 0,
      deathsWomenChildren: 0,
      deathDetails: "No fatalities",
      injuriesMen: 3,
      injuriesWomenChildren: 2,
      injuriesDetails: "Minor injuries from scuffle",
      lossesProperty: 2000,
      lossesDetails: "Damage to electoral materials and equipment",
    },

    // Context details
    context: {
      informationCredibility: "medium",
      informationSource: "Electoral Commission Report",
      geographicScope: "Local",
      impact: "medium",
      weaponsUse: "None",
      details: "Disruption of voting process and damage to property",
    },

    // UI display properties
    reporter: "John Doe",
    subIndicator: "Electoral Violence",
    region: "Ashanti Region",
  },
];
