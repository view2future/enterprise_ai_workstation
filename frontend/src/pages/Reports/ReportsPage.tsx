import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Eye,
  PieChart,
  LineChart,
  Plus,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Download as DownloadIcon,
  Save,
  RotateCcw
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportApi, ReportType, ReportFormat, ReportStatus, CreateReportDto } from '../../services/report.service';
import { NeubrutalCard, NeubrutalButton, NeubrutalInput, NeubrutalSelect } from '../../components/ui/neubrutalism/NeubrutalComponents';

const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(ReportType.SUMMARY);
  const [reportFormat, setReportFormat] = useState<ReportFormat>(ReportFormat.EXCEL);
  const [reportTitle, setReportTitle] = useState('企业数据分析报告');
  const [reportDescription, setReportDescription] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const queryClient = useQueryClient();

  const reportTypes = [
    { id: ReportType.SUMMARY, label: '数据概览报告', icon: BarChart3 },
    { id: ReportType.DETAILED, label: '详细分析报告', icon: FileText },
    { id: ReportType.TRENDS, label: '趋势分析报告', icon: TrendingUp },
    { id: ReportType.PRIORITY, label: '优先级分析报告', icon: Users },
    { id: ReportType.AI_USAGE, label: 'AI使用分析报告', icon: Eye },
    { id: ReportType.REGIONAL, label: '地区分布报告', icon: PieChart },
    { id: ReportType.PARTNER, label: '伙伴等级报告', icon: LineChart },
  ];

  const reportFormats = [
    { id: ReportFormat.PDF, label: 'PDF' },
    { id: ReportFormat.EXCEL, label: 'Excel' },
    { id: ReportFormat.CSV, label: 'CSV' },
    { id: ReportFormat.JSON, label: 'JSON' },
  ];

  // 获取报告列表
  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportApi.getReports().then(res => res.data),
    refetchOnWindowFocus: false,
  });

  // 创建报告
  const createReportMutation = useMutation({
    mutationFn: (data: CreateReportDto) => reportApi.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const handleCreateReport = () => {
    const createData: CreateReportDto = {
      title: reportTitle,
      type: selectedReportType,
      format: reportFormat,
      description: reportDescription,
      filters: filters,
    };

    createReportMutation.mutate(createData);
  };

  const handleDownloadReport = (id: number) => {
    reportApi.downloadReport(id).then(response => {
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${id}.download`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED:
        return <CheckCircle size={16} className="text-green-600" />;
      case ReportStatus.FAILED:
        return <AlertCircle size={16} className="text-red-600" />;
      case ReportStatus.PROCESSING:
      case ReportStatus.PENDING:
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ReportStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case ReportStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case ReportStatus.PENDING:
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">报告中心</h1>
        <p className="text-gray-600">生成和查看企业数据分析报告</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边栏 - 报告类型选择和生成表单 */}
        <div className="lg:w-80 space-y-6">
          <NeubrutalCard>
            <h2 className="text-lg font-semibold mb-4">生成新报告</h2>
            
            <div className="space-y-4">
              <div>
                <NeubrutalInput
                  label="报告标题"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="输入报告标题"
                />
              </div>
              
              <div>
                <NeubrutalSelect
                  label="报告类型"
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                >
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </NeubrutalSelect>
              </div>
              
              <div>
                <NeubrutalSelect
                  label="输出格式"
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value as ReportFormat)}
                >
                  {reportFormats.map((format) => (
                    <option key={format.id} value={format.id}>{format.label}</option>
                  ))}
                </NeubrutalSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="neubrutal-input w-full px-3 py-2 rounded-lg"
                  placeholder="报告描述..."
                  rows={3}
                />
              </div>
              
              <NeubrutalButton
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                variant="secondary"
                className="w-full"
              >
                <Filter size={18} className="mr-2" />
                {showFilterPanel ? '隐藏筛选条件' : '设置筛选条件'}
              </NeubrutalButton>
              
              {showFilterPanel && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-2">筛选条件</h3>
                  <div className="space-y-3">
                    <div>
                      <NeubrutalSelect
                        label="优先级"
                        value={filters.优先级 || ''}
                        onChange={(e) => setFilters({...filters, 优先级: e.target.value})}
                      >
                        <option value="">全部</option>
                        <option value="P0">P0</option>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                      </NeubrutalSelect>
                    </div>
                    
                    <div>
                      <NeubrutalSelect
                        label="飞桨/文心"
                        value={filters.飞桨_文心 || ''}
                        onChange={(e) => setFilters({...filters, 飞桨_文心: e.target.value})}
                      >
                        <option value="">全部</option>
                        <option value="飞桨">飞桨</option>
                        <option value="文心">文心</option>
                      </NeubrutalSelect>
                    </div>
                    
                    <div>
                      <NeubrutalInput
                        label="地区"
                        value={filters.base || ''}
                        onChange={(e) => setFilters({...filters, base: e.target.value})}
                        placeholder="地区名称"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <NeubrutalButton
                onClick={handleCreateReport}
                disabled={createReportMutation.isPending}
                variant="primary"
                className="w-full"
              >
                {createReportMutation.isPending ? (
                  <>
                    <span className="loading-spinner mr-2">⏳</span>
                    生成中...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    生成报告
                  </>
                )}
              </NeubrutalButton>
            </div>
          </NeubrutalCard>
          
          {/* 历史报告列表 */}
          <NeubrutalCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">历史报告</h2>
              <NeubrutalButton 
                variant="secondary" 
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['reports'] })}
              >
                <RotateCcw size={16} />
              </NeubrutalButton>
            </div>
            
            {isLoadingReports ? (
              <div className="flex justify-center items-center h-32">
                <div className="loading-spinner text-2xl">⏳</div>
              </div>
            ) : reportsData?.items && reportsData.items.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reportsData.items.map((report) => (
                  <div key={report.id} className="p-3 border-2 border-gray-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{report.title}</h3>
                        <p className="text-xs text-gray-600">{report.type} • {report.format}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(report.status)}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                            {report.status === ReportStatus.PENDING && '等待中'}
                            {report.status === ReportStatus.PROCESSING && '处理中'}
                            {report.status === ReportStatus.COMPLETED && '已完成'}
                            {report.status === ReportStatus.FAILED && '失败'}
                          </span>
                        </div>
                        {report.status === ReportStatus.PROCESSING && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${report.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{report.progress}%</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {report.status === ReportStatus.COMPLETED && (
                          <NeubrutalButton
                            size="sm"
                            variant="success"
                            onClick={() => handleDownloadReport(report.id)}
                            title="下载报告"
                          >
                            <DownloadIcon size={16} />
                          </NeubrutalButton>
                        )}
                        <NeubrutalButton
                          size="sm"
                          variant="danger"
                          onClick={() => console.log('Delete report', report.id)}
                          title="删除报告"
                        >
                          <X size={16} />
                        </NeubrutalButton>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-2">
                      生成时间: {new Date(report.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">暂无历史报告</p>
            )}
          </NeubrutalCard>
        </div>

        {/* 主内容区 - 报告预览 */}
        <div className="flex-1">
          <NeubrutalCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {reportTypes.find(r => r.id === selectedReportType)?.label}
              </h2>
              <div className="text-sm text-gray-600">
                <Calendar size={16} className="inline mr-1" />
                实时预览
              </div>
            </div>

            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">报告预览</h3>
                <p className="text-gray-600 mb-4">
                  选择报告类型和筛选条件，然后点击"生成报告"按钮
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-white border-2 border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">526</div>
                    <div className="text-sm text-gray-600">企业总数</div>
                  </div>
                  <div className="p-4 bg-white border-2 border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">89</div>
                    <div className="text-sm text-gray-600">P0优先级</div>
                  </div>
                  <div className="p-4 bg-white border-2 border-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">52.1%</div>
                    <div className="text-sm text-gray-600">成都占比</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">报告配置</h3>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">类型:</span> {reportTypes.find(r => r.id === selectedReportType)?.label}</li>
                  <li><span className="font-medium">格式:</span> {reportFormats.find(f => f.id === reportFormat)?.label}</li>
                  <li><span className="font-medium">标题:</span> {reportTitle}</li>
                </ul>
              </div>
              <div className="p-4 border-2 border-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">筛选条件</h3>
                <ul className="text-sm space-y-1">
                  <li><span className="font-medium">优先级:</span> {filters.优先级 || '全部'}</li>
                  <li><span className="font-medium">飞桨/文心:</span> {filters.飞桨_文心 || '全部'}</li>
                  <li><span className="font-medium">地区:</span> {filters.base || '全部'}</li>
                </ul>
              </div>
            </div>
          </NeubrutalCard>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;