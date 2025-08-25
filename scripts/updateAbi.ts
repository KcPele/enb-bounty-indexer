import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the compiled contract artifact
const artifactPath = path.join(
  __dirname,
  "../../bounty-contract/artifacts/contracts/ENBBountyNft.sol/ENBBountyNft.json"
);
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

// Extract the ABI
const abi = artifact.abi;

// Create the TypeScript ABI file content
const abiContent = `const ENBBountyNFTABI = ${JSON.stringify(
  abi,
  null,
  2
)} as const;

export default ENBBountyNFTABI;
`;

// Write to the ABI file
const abiPath = path.join(__dirname, "../abis/ENBBountyNFTAbi.ts");
fs.writeFileSync(abiPath, abiContent);

console.log("ABI updated successfully!");

// to run: npx tsx scripts/updateAbi.ts
