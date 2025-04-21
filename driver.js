"use strict";

let blindSignatures = require('blind-signatures');
let SpyAgency = require('./spyAgency.js').SpyAgency;

function makeDocument(coverName) {
  return `🔏 Document for Agent: ${coverName}\n🎖️ Status: Full Diplomatic Immunity Granted`;
}

// 🔹 استبدال جميع الأسماء القديمة بأسماء جديدة كليًا  
let coverNames = [
  "Jonathan Drake",
  "Sophia West",
  "Alexander Knight",
  "Victoria Hale",
  "Christopher Vaughn",
  "Natalie Pierce",
  "Daniel Mercer",
  "Isla Montgomery",
  "Ethan Caldwell",
  "Scarlett Hayes"
];

let documents = coverNames.map(makeDocument);

let blindDocs = [];
let blindingFactors = [];

let agency = new SpyAgency();

// 🔹 تجهيز المستندات للتوقيع الأعمى
documents.forEach((doc) => {
  let { blinded, r } = blindSignatures.blind({
    message: doc,
    N: agency.n,
    E: agency.e,
  });
  blindDocs.push(blinded);
  blindingFactors.push(r);
});

// 🔹 تحسين الإخراج وإضافة فواصل ورسائل واضحة
console.log("\n==============================================");
console.log("🚀 🔒 SPY AGENCY - SECURE BLIND SIGNATURE SYSTEM 🔒 🚀");
console.log("==============================================\n");

agency.signDocument(blindDocs, (selected, verifyAndSign) => {
  let signedBlinds = verifyAndSign(
    blindingFactors.map((r, i) => (i === selected ? undefined : r)),
    documents.map((doc, i) => (i === selected ? undefined : doc))
  );

  let unblindedSig = blindSignatures.unblind({
    signed: signedBlinds,
    N: agency.n,
    r: blindingFactors[selected],
  });

  let isValid = blindSignatures.verify({
    unblinded: unblindedSig,
    N: agency.n,
    E: agency.e,
    message: documents[selected],
  });

  console.log("🔍 **AGENCY HAS SELECTED A DOCUMENT FOR SIGNING** 🔍");
  console.log("--------------------------------------------------");
  console.log(`📌 **Agent Identity:**      "${coverNames[selected]}"`);
  console.log(`📜 **Official Document:**\n"${documents[selected]}"\n`);
  
  console.log("✍️ **Signing Process Initiated...**");
  console.log("--------------------------------------------------");

  if (isValid) {
    console.log("✅ \x1b[32mSIGNATURE VERIFIED - DOCUMENT IS AUTHENTIC\x1b[0m");
  } else {
    console.log("❌ \x1b[31mSIGNATURE VERIFICATION FAILED - POSSIBLE FORGERY DETECTED!\x1b[0m");
  }

  console.log("\n==============================================");
  console.log("🔐 MISSION COMPLETE - DOCUMENT SECURELY SIGNED 🔐");
  console.log("==============================================");
});