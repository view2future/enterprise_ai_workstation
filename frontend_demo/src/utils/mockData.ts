import { Enterprise, Task, ChartDataItem } from '../types';

// Mock enterprises data
export const mockEnterprises: Enterprise[] = [
  {
    id: 1,
    name: "智能科技有限公司",
    unifiedCode: "91310000MA1K3XXXXX",
    legalRep: "张三",
    registeredCapital: 1000,
    registrationDate: "2020-05-15",
    businessStatus: "存续",
    industryType: "人工智能",
    subIndustry: "智能制造",
    region: "华东",
    city: "上海",
    employeeCount: 150,
    annualRevenue: 5000,
    website: "www.example.com",
    contactPerson: "李经理",
    contactPhone: "13800138000",
    contactEmail: "contact@example.com",
    remarks: "重点关注企业",
    dynamicAttributes: {
      patentCount: 25,
      innovationIndex: 85
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-11-15T10:30:00Z",
    financings: [
      {
        id: 1,
        enterpriseId: 1,
        round: "A轮",
        amountRaised: 2000,
        currency: "CNY",
        financingDate: "2022-03-10",
        investorNames: "创新资本",
        valuationAfter: 8000,
      }
    ],
    aiApplications: [
      {
        id: 1,
        enterpriseId: 1,
        aiScenario: "质量控制",
        aiApplicationDesc: "基于计算机视觉的产品质检系统",
        implementationStage: "production",
        deploymentDate: "2022-06-01",
        estimatedRoi: 15,
        challengesEncountered: "初期数据标注成本高",
      }
    ],
    baiduAiUsage: {
      id: 1,
      enterpriseId: 1,
      baiduAiProductsUsed: ["EasyDL", "UNIT"],
      usageLevel: "production",
      adoptionDate: "2021-12-01",
      primaryUseCase: "产品分类识别",
      satisfactionRating: 4,
      notes: "EasyDL平台使用效果良好",
    },
    operationalTags: [
      {
        id: 1,
        enterpriseId: 1,
        tagName: "高潜力",
        assignedBy: "user1",
        assignedDate: "2023-05-20",
      }
    ]
  },
  {
    id: 2,
    name: "数据智能有限公司",
    unifiedCode: "91310000MA1K4XXXXX",
    legalRep: "李四",
    registeredCapital: 500,
    registrationDate: "2019-08-20",
    businessStatus: "存续",
    industryType: "大数据",
    subIndustry: "数据分析",
    region: "华北",
    city: "北京",
    employeeCount: 80,
    annualRevenue: 3000,
    website: "www.dataai.com",
    contactPerson: "王总监",
    contactPhone: "13900139000",
    contactEmail: "info@dataai.com",
    remarks: "AI应用待拓展",
    dynamicAttributes: {
      dataSources: 15,
      processingCapacity: "10TB/day"
    },
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-10-20T14:20:00Z",
    financings: [
      {
        id: 2,
        enterpriseId: 2,
        round: "种子轮",
        amountRaised: 500,
        currency: "CNY",
        financingDate: "2020-06-15",
        investorNames: "天使投资",
        valuationAfter: 2000,
      }
    ],
    aiApplications: [
      {
        id: 2,
        enterpriseId: 2,
        aiScenario: "预测性维护",
        aiApplicationDesc: "基于机器学习的设备故障预测系统",
        implementationStage: "pilot",
        deploymentDate: "2023-01-15",
        estimatedRoi: 8,
        challengesEncountered: "数据质量参差不齐",
      }
    ],
    baiduAiUsage: {
      id: 2,
      enterpriseId: 2,
      baiduAiProductsUsed: ["BML"],
      usageLevel: "evaluating",
      adoptionDate: "2022-08-01",
      primaryUseCase: "模型训练",
      satisfactionRating: 3,
      notes: "BML平台功能丰富，但学习曲线较陡",
    },
    operationalTags: [
      {
        id: 2,
        enterpriseId: 2,
        tagName: "跟进中",
        assignedBy: "user2",
        assignedDate: "2023-07-10",
      }
    ]
  },
  {
    id: 3,
    name: "视觉识别有限公司",
    unifiedCode: "91310000MA1K5XXXXX",
    legalRep: "王五",
    registeredCapital: 800,
    registrationDate: "2021-03-10",
    businessStatus: "存续",
    industryType: "人工智能",
    subIndustry: "计算机视觉",
    region: "华南",
    city: "深圳",
    employeeCount: 120,
    annualRevenue: 4500,
    website: "www.visionai.com",
    contactPerson: "赵经理",
    contactPhone: "13700137000",
    contactEmail: "contact@visionai.com",
    remarks: "技术实力强",
    dynamicAttributes: {
      computerVisionProjects: 30,
      accuracyRate: 95.5
    },
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2023-12-01T09:15:00Z",
    financings: [
      {
        id: 3,
        enterpriseId: 3,
        round: "Pre-A轮",
        amountRaised: 1000,
        currency: "CNY",
        financingDate: "2021-10-25",
        investorNames: "成长基金",
        valuationAfter: 5000,
      }
    ],
    aiApplications: [
      {
        id: 3,
        enterpriseId: 3,
        aiScenario: "智能安防",
        aiApplicationDesc: "基于深度学习的视频监控分析系统",
        implementationStage: "scaled",
        deploymentDate: "2021-12-10",
        estimatedRoi: 20,
        challengesEncountered: "隐私合规要求严格",
      }
    ],
    baiduAiUsage: {
      id: 3,
      enterpriseId: 3,
      baiduAiProductsUsed: ["EasyDL", "Qianfan"],
      usageLevel: "extensive",
      adoptionDate: "2021-05-15",
      primaryUseCase: "模型部署",
      satisfactionRating: 5,
      notes: "Qianfan平台API调用稳定",
    },
    operationalTags: [
      {
        id: 3,
        enterpriseId: 3,
        tagName: "重点关注",
        assignedBy: "user1",
        assignedDate: "2023-01-15",
      }
    ]
  },
  {
    id: 4,
    name: "自然语言处理科技有限公司",
    unifiedCode: "91310000MA1K6XXXXX",
    legalRep: "赵六",
    registeredCapital: 1200,
    registrationDate: "2020-11-10",
    businessStatus: "存续",
    industryType: "人工智能",
    subIndustry: "自然语言处理",
    region: "华北",
    city: "北京",
    employeeCount: 90,
    annualRevenue: 3800,
    website: "www.nlp-tech.com",
    contactPerson: "孙主任",
    contactPhone: "13600136000",
    contactEmail: "contact@nlp-tech.com",
    remarks: "NLP技术领先",
    dynamicAttributes: {
      nlpModelsDeployed: 15,
      languageSupport: "中文、英文、日语"
    },
    createdAt: "2023-04-20T00:00:00Z",
    updatedAt: "2023-11-20T11:45:00Z",
    financings: [
      {
        id: 4,
        enterpriseId: 4,
        round: "B轮",
        amountRaised: 3500,
        currency: "CNY",
        financingDate: "2022-08-15",
        investorNames: "风险投资A",
        valuationAfter: 12000,
      }
    ],
    aiApplications: [
      {
        id: 4,
        enterpriseId: 4,
        aiScenario: "智能客服",
        aiApplicationDesc: "多语言智能客服对话系统",
        implementationStage: "production",
        deploymentDate: "2022-01-20",
        estimatedRoi: 12,
        challengesEncountered: "方言处理仍有挑战",
      }
    ],
    baiduAiUsage: {
      id: 4,
      enterpriseId: 4,
      baiduAiProductsUsed: ["UNIT", "ASR", "TTS"],
      usageLevel: "production",
      adoptionDate: "2021-09-10",
      primaryUseCase: "语音交互",
      satisfactionRating: 4,
      notes: "语音识别准确率较高",
    },
    operationalTags: [
      {
        id: 4,
        enterpriseId: 4,
        tagName: "技术领先",
        assignedBy: "user3",
        assignedDate: "2023-03-10",
      }
    ]
  },
  {
    id: 5,
    name: "医疗AI科技有限公司",
    unifiedCode: "91310000MA1K7XXXXX",
    legalRep: "钱七",
    registeredCapital: 2000,
    registrationDate: "2019-06-05",
    businessStatus: "存续",
    industryType: "人工智能",
    subIndustry: "医疗AI",
    region: "华东",
    city: "杭州",
    employeeCount: 200,
    annualRevenue: 7500,
    website: "www.medical-ai.com",
    contactPerson: "周医生",
    contactPhone: "13500135000",
    contactEmail: "contact@medical-ai.com",
    remarks: "医疗影像分析专家",
    dynamicAttributes: {
      medicalImagingAlgorithms: 12,
      hospitalsUsing: 50
    },
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2023-12-10T08:30:00Z",
    financings: [
      {
        id: 5,
        enterpriseId: 5,
        round: "C轮",
        amountRaised: 8000,
        currency: "CNY",
        financingDate: "2022-12-10",
        investorNames: "医疗基金",
        valuationAfter: 30000,
      }
    ],
    aiApplications: [
      {
        id: 5,
        enterpriseId: 5,
        aiScenario: "医学影像诊断",
        aiApplicationDesc: "肺部结节检测AI系统",
        implementationStage: "scaled",
        deploymentDate: "2021-08-01",
        estimatedRoi: 25,
        challengesEncountered: "监管审批周期较长",
      }
    ],
    baiduAiUsage: {
      id: 5,
      enterpriseId: 5,
      baiduAiProductsUsed: ["EasyDL", "BML"],
      usageLevel: "extensive",
      adoptionDate: "2021-03-15",
      primaryUseCase: "模型训练与部署",
      satisfactionRating: 5,
      notes: "平台稳定性好，技术支持及时",
    },
    operationalTags: [
      {
        id: 5,
        enterpriseId: 5,
        tagName: "重点合作",
        assignedBy: "user1",
        assignedDate: "2023-02-15",
      }
    ]
  }
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: 1,
    title: "跟进智能科技AI合作",
    description: "联系张三，讨论AI技术合作可能性",
    enterpriseId: 1,
    assignedTo: "分析师A",
    priority: "high",
    status: "in-progress",
    dueDate: "2023-12-20",
    createdAt: "2023-12-10T09:00:00Z",
    updatedAt: "2023-12-15T14:30:00Z"
  },
  {
    id: 2,
    title: "数据智能融资跟进",
    description: "了解B轮融资进展，评估投资价值",
    enterpriseId: 2,
    assignedTo: "分析师B",
    priority: "medium",
    status: "todo",
    dueDate: "2023-12-25",
    createdAt: "2023-12-12T10:15:00Z",
    updatedAt: "2023-12-12T10:15:00Z"
  },
  {
    id: 3,
    title: "视觉识别技术评估",
    description: "评估其计算机视觉技术实力，考虑合作",
    enterpriseId: 3,
    assignedTo: "分析师A",
    priority: "high",
    status: "done",
    dueDate: "2023-12-14",
    createdAt: "2023-12-05T11:30:00Z",
    updatedAt: "2023-12-14T16:45:00Z"
  },
  {
    id: 4,
    title: "NLP科技产品演示安排",
    description: "安排下周产品演示会议",
    enterpriseId: 4,
    assignedTo: "分析师C",
    priority: "medium",
    status: "todo",
    dueDate: "2023-12-22",
    createdAt: "2023-12-13T12:20:00Z",
    updatedAt: "2023-12-13T12:20:00Z"
  },
  {
    id: 5,
    title: "医疗AI合规审核",
    description: "核查医疗AI产品的合规性",
    enterpriseId: 5,
    assignedTo: "分析师A",
    priority: "high",
    status: "in-progress",
    dueDate: "2023-12-18",
    createdAt: "2023-12-08T09:45:00Z",
    updatedAt: "2023-12-15T10:30:00Z"
  }
];

// Analytics mock data
export const industryDistribution: ChartDataItem[] = [
  { name: "人工智能", value: 40 },
  { name: "大数据", value: 20 },
  { name: "云计算", value: 15 },
  { name: "物联网", value: 10 },
  { name: "其他", value: 15 },
];

export const aiScenarioDistribution: ChartDataItem[] = [
  { name: "质量控制", value: 25 },
  { name: "预测性维护", value: 15 },
  { name: "智能安防", value: 20 },
  { name: "智能客服", value: 10 },
  { name: "医学影像", value: 15 },
  { name: "其他", value: 15 },
];

export const monthlyTrendData: ChartDataItem[] = [
  { name: "一月", value: 45 },
  { name: "二月", value: 52 },
  { name: "三月", value: 48 },
  { name: "四月", value: 61 },
  { name: "五月", value: 58 },
  { name: "六月", value: 70 },
  { name: "七月", value: 65 },
  { name: "八月", value: 72 },
  { name: "九月", value: 78 },
  { name: "十月", value: 82 },
  { name: "十一月", value: 85 },
  { name: "十二月", value: 88 },
];