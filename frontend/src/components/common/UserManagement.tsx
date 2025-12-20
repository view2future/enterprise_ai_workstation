import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, User } from '../../services/auth.service';
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react';

interface UserManagementProps {
  currentUserRole: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUserRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // 获取所有用户
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getAllUsers().then(res => res.data),
    enabled: currentUserRole === 'admin',
  });

  // 删除用户
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => authApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      deleteUserMutation.mutate(id);
    }
  };

  const filteredUsers = users?.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentUserRole !== 'admin') {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">您没有权限访问用户管理功能</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">获取用户列表失败: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">用户管理</h2>
        <button 
          className="neubrutal-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          添加用户
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="neubrutal-card bg-white p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neubrutal-input w-full pl-10 pr-3 py-2 rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="neubrutal-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === 'analyst' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '管理员' : 
                       user.role === 'analyst' ? '分析师' : '操作员'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 用户编辑模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="neubrutal-card bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? '编辑用户' : '添加用户'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  className="neubrutal-input w-full px-3 py-2 rounded-lg"
                  defaultValue={editingUser?.username || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  className="neubrutal-input w-full px-3 py-2 rounded-lg"
                  defaultValue={editingUser?.email || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <select
                  className="neubrutal-input w-full px-3 py-2 rounded-lg"
                  defaultValue={editingUser?.role || 'analyst'}
                >
                  <option value="analyst">分析师</option>
                  <option value="operator">操作员</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="neubrutal-button bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    // TODO: 实现保存逻辑
                    setIsModalOpen(false);
                  }}
                  className="neubrutal-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;