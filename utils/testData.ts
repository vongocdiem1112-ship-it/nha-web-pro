import { User } from '@/contexts/AppContext';

export const testUsers = {
  user: {
    id: 'u1',
    name: 'Nguyễn Văn Test',
    email: 'user@test.com',
    phone: '0901234567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'user' as const,
  },
  broker: {
    id: 'b1',
    name: 'Trần Thị Broker',
    email: 'broker@test.com',
    phone: '0912345678',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'broker' as const,
    brokerStatus: 'approved' as const,
    zalo: '0912345678',
    facebook: 'tranthibroker',
  },
  brokerPending: {
    id: 'b2',
    name: 'Lê Văn Pending',
    email: 'pending@test.com',
    phone: '0923456789',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'broker' as const,
    brokerStatus: 'pending' as const,
  },
};
