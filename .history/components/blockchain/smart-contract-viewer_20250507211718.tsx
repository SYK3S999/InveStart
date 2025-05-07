"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, FileText, ArrowRight, Shield } from "lucide-react"

interface SmartContractViewerProps {
  contractName: string
  contractAddress: string
  contractType: "funding" | "investment" | "project" | "user"
  deploymentDate: string
  network: "ethereum" | "hyperledger" | "polygon"
}

export default function SmartContractViewer({
  contractName,
  contractAddress,
  contractType,
  deploymentDate,
  network,
}: SmartContractViewerProps) {
  const [activeTab, setActiveTab] = useState("code")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getContractCode = () => {
    switch (contractType) {
      case "funding":
        return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title FundingContract
 * @dev عقد ذكي للتمويل الجماعي
 */
contract FundingContract {
    address public owner;
    uint256 public goalAmount;
    uint256 public raisedAmount;
    uint256 public deadline;
    bool public fundingClosed;
    
    mapping(address => uint256) public contributions;
    
    event FundReceived(address contributor, uint256 amount);
    event FundingSuccessful(uint256 totalAmount);
    event FundingFailed(uint256 totalAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    constructor(uint256 _goalAmount, uint256 _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
        fundingClosed = false;
    }
    
    function contribute() public payable {
        require(block.timestamp < deadline, "Funding period has ended");
        require(!fundingClosed, "Funding is closed");
        
        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
        
        emit FundReceived(msg.sender, msg.value);
    }
    
    function checkFundingStatus() public {
        require(block.timestamp >= deadline, "Funding period is still active");
        require(!fundingClosed, "Funding status already determined");
        
        if (raisedAmount >= goalAmount) {
            // Transfer funds to the project owner
            payable(owner).transfer(raisedAmount);
            emit FundingSuccessful(raisedAmount);
        } else {
            // Refund contributors
            emit FundingFailed(raisedAmount);
        }
        
        fundingClosed = true;
    }
    
    function getRefund() public {
        require(block.timestamp >= deadline, "Funding period is still active");
        require(fundingClosed, "Funding status not yet determined");
        require(raisedAmount < goalAmount, "Funding was successful, no refunds");
        require(contributions[msg.sender] > 0, "No contribution to refund");
        
        uint256 amount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}`
      case "investment":
        return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title InvestmentContract
 * @dev عقد ذكي للاستثمار
 */
contract InvestmentContract {
    address public projectOwner;
    address public investor;
    uint256 public investmentAmount;
    uint256 public equityPercentage;
    bool public agreementSigned;
    
    event InvestmentReceived(address investor, uint256 amount);
    event AgreementSigned(address projectOwner, address investor);
    
    modifier onlyParties() {
        require(msg.sender == projectOwner || msg.sender == investor, "Only contract parties can call this function");
        _;
    }
    
    constructor(address _projectOwner, address _investor, uint256 _equityPercentage) {
        projectOwner = _projectOwner;
        investor = _investor;
        equityPercentage = _equityPercentage;
        agreementSigned = false;
    }
    
    function invest() public payable {
        require(msg.sender == investor, "Only the investor can call this function");
        require(!agreementSigned, "Agreement already signed");
        
        investmentAmount = msg.value;
        emit InvestmentReceived(investor, investmentAmount);
    }
    
    function signAgreement() public onlyParties {
        require(investmentAmount > 0, "Investment amount must be greater than 0");
        require(!agreementSigned, "Agreement already signed");
        
        agreementSigned = true;
        
        // Transfer investment to project owner
        payable(projectOwner).transfer(investmentAmount);
        
        emit AgreementSigned(projectOwner, investor);
    }
}`
      case "project":
        return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ProjectContract
 * @dev عقد ذكي لإدارة المشروع
 */
contract ProjectContract {
    struct Milestone {
        string description;
        uint256 deadline;
        bool completed;
        bool fundsReleased;
    }
    
    address public projectOwner;
    string public projectName;
    string public projectDescription;
    uint256 public totalFunding;
    
    Milestone[] public milestones;
    mapping(address => bool) public stakeholders;
    
    event MilestoneCompleted(uint256 milestoneId);
    event FundsReleased(uint256 milestoneId, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == projectOwner, "Only the project owner can call this function");
        _;
    }
    
    modifier onlyStakeholder() {
        require(stakeholders[msg.sender], "Only stakeholders can call this function");
        _;
    }
    
    constructor(string memory _name, string memory _description) {
        projectOwner = msg.sender;
        projectName = _name;
        projectDescription = _description;
        stakeholders[msg.sender] = true;
    }
    
    function addStakeholder(address _stakeholder) public onlyOwner {
        stakeholders[_stakeholder] = true;
    }
    
    function addMilestone(string memory _description, uint256 _deadlineInDays) public onlyOwner {
        uint256 deadline = block.timestamp + (_deadlineInDays * 1 days);
        milestones.push(Milestone(_description, deadline, false, false));
    }
    
    function completeMilestone(uint256 _milestoneId) public onlyStakeholder {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        require(!milestones[_milestoneId].completed, "Milestone already completed");
        
        milestones[_milestoneId].completed = true;
        emit MilestoneCompleted(_milestoneId);
    }
    
    function releaseFunds(uint256 _milestoneId, uint256 _amount) public onlyOwner {
        require(_milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[_milestoneId].completed, "Milestone not completed");
        require(!milestones[_milestoneId].fundsReleased, "Funds already released");
        require(_amount <= address(this).balance, "Insufficient contract balance");
        
        milestones[_milestoneId].fundsReleased = true;
        payable(projectOwner).transfer(_amount);
        
        emit FundsReleased(_milestoneId, _amount);
    }
}`
      case "user":
        return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title UserRegistry
 * @dev عقد ذكي لتسجيل المستخدمين
 */
contract UserRegistry {
    struct User {
        string name;
        string role; // "startup", "investor", "admin"
        uint256 registrationDate;
        bool active;
    }
    
    address public owner;
    mapping(address => User) public users;
    mapping(address => bool) public verifiedUsers;
    
    event UserRegistered(address userAddress, string name, string role);
    event UserVerified(address userAddress);
    event UserDeactivated(address userAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerUser(string memory _name, string memory _role) public {
        require(bytes(users[msg.sender].name).length == 0, "User already registered");
        
        users[msg.sender] = User(_name, _role, block.timestamp, true);
        emit UserRegistered(msg.sender, _name, _role);
    }
    
    function verifyUser(address _userAddress) public onlyOwner {
        require(bytes(users[_userAddress].name).length > 0, "User not registered");
        require(!verifiedUsers[_userAddress], "User already verified");
        
        verifiedUsers[_userAddress] = true;
        emit UserVerified(_userAddress);
    }
    
    function deactivateUser(address _userAddress) public onlyOwner {
        require(bytes(users[_userAddress].name).length > 0, "User not registered");
        require(users[_userAddress].active, "User already deactivated");
        
        users[_userAddress].active = false;
        emit UserDeactivated(_userAddress);
    }
    
    function isUserVerified(address _userAddress) public view returns (bool) {
        return verifiedUsers[_userAddress];
    }
}`
      default:
        return "// No contract code available"
    }
  }

  const getContractABI = () => {
    switch (contractType) {
      case "funding":
        return `[
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_goalAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationInDays",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "contributor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "name": "FundingFailed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256"
      }
    ],
    "name": "FundingSuccessful",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "checkFundingStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "contributions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deadline",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundingClosed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "goalAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "raisedAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`
      default:
        return "// ABI not available"
    }
  }

  const getContractFunctions = () => {
    switch (contractType) {
      case "funding":
        return [
          { name: "contribute()", description: "المساهمة في تمويل المشروع", payable: true },
          { name: "checkFundingStatus()", description: "التحقق من حالة التمويل", payable: false },
          { name: "getRefund()", description: "استرداد الأموال في حالة فشل التمويل", payable: false },
        ]
      case "investment":
        return [
          { name: "invest()", description: "استثمار الأموال في المشروع", payable: true },
          { name: "signAgreement()", description: "توقيع اتفاقية الاستثمار", payable: false },
        ]
      case "project":
        return [
          { name: "addStakeholder(address)", description: "إضافة صاحب مصلحة للمشروع", payable: false },
          { name: "addMilestone(string, uint256)", description: "إضافة مرحلة جديدة للمشروع", payable: false },
          { name: "completeMilestone(uint256)", description: "إكمال مرحلة من المشروع", payable: false },
          { name: "releaseFunds(uint256, uint256)", description: "إطلاق الأموال بعد إكمال المرحلة", payable: false },
        ]
      case "user":
        return [
          { name: "registerUser(string, string)", description: "تسجيل مستخدم جديد", payable: false },
          { name: "verifyUser(address)", description: "التحقق من مستخدم", payable: false },
          { name: "deactivateUser(address)", description: "إلغاء تنشيط مستخدم", payable: false },
          { name: "isUserVerified(address)", description: "التحقق من حالة المستخدم", payable: false },
        ]
      default:
        return []
    }
  }

  const getNetworkInfo = () => {
    switch (network) {
      case "ethereum":
        return {
          name: "Ethereum",
          icon: "🔷",
          explorerUrl: "https://etherscan.io/address/",
          color: "text-blue-600",
        }
      case "hyperledger":
        return {
          name: "Hyperledger Fabric",
          icon: "🔶",
          explorerUrl: "#",
          color: "text-amber-600",
        }
      case "polygon":
        return {
          name: "Polygon",
          icon: "🟣",
          explorerUrl: "https://polygonscan.com/address/",
          color: "text-purple-600",
        }
      default:
        return {
          name: "Ethereum",
          icon: "🔷",
          explorerUrl: "https://etherscan.io/address/",
          color: "text-blue-600",
        }
    }
  }

  const networkInfo = getNetworkInfo()

  return (
    <Card className="border-primary-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary-600 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {contractName}
          </CardTitle>
          <Badge
            variant="outline"
            className={`bg-primary-50 text-primary-500 border-primary-200 flex items-center gap-1 ${networkInfo.color}`}
          >
            <span>{networkInfo.icon}</span>
            {networkInfo.name}
          </Badge>
        </div>
        <CardDescription>
          عقد ذكي{" "}
          {contractType === "funding"
            ? "للتمويل"
            : contractType === "investment"
              ? "للاستثمار"
              : contractType === "project"
                ? "للمشروع"
                : "للمستخدم"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-medium text-gray-500">عنوان العقد</h4>
            <Button variant="ghost" size="sm" className="h-6 px-2" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <div className="bg-gray-50 p-2 rounded border border-gray-200 font-mono text-xs break-all">
            {contractAddress}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-1">تاريخ النشر</h4>
          <p className="font-medium">{new Date(deploymentDate).toLocaleString("ar-DZ")}</p>
        </div>

        <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="code" className="text-xs sm:text-sm">
              الكود
            </TabsTrigger>
            <TabsTrigger value="abi" className="text-xs sm:text-sm">
              ABI
            </TabsTrigger>
            <TabsTrigger value="functions" className="text-xs sm:text-sm">
              الوظائف
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-0">
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono h-64 overflow-y-auto">
              <pre>{getContractCode()}</pre>
            </div>
          </TabsContent>
          <TabsContent value="abi" className="mt-0">
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono h-64 overflow-y-auto">
              <pre>{getContractABI()}</pre>
            </div>
          </TabsContent>
          <TabsContent value="functions" className="mt-0">
            <div className="bg-gray-50 rounded-md border border-gray-200 h-64 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {getContractFunctions().map((func, index) => (
                  <div key={index} className="p-3 hover:bg-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-mono text-sm text-primary-600">{func.name}</p>
                        <p className="text-sm text-gray-600">{func.description}</p>
                      </div>
                      {func.payable && <Badge className="bg-amber-100 text-amber-800 border-amber-200">payable</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={`${networkInfo.explorerUrl}${contractAddress}`} target="_blank" rel="noopener noreferrer">
            عرض في مستكشف البلوكتشين
            <ArrowRight className="h-4 w-4 mr-1" />
          </a>
        </Button>

        <div className="flex items-center gap-2 text-green-600 text-sm mr-auto">
          <Shield className="h-4 w-4" />
          <span>مؤمن ومتحقق منه</span>
        </div>
      </CardFooter>
    </Card>
  )
}
