import { Link } from 'react-router-dom';
import { Users, UserPlus, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/hooks';

const mockUsers = [
  { id: '1', name: 'John Pharmacist', email: 'john@pharmacy.com', role: 'admin' },
  { id: '2', name: 'Sarah Staff', email: 'sarah@pharmacy.com', role: 'staff' },
  { id: '3', name: 'Mike Clerk', email: 'mike@pharmacy.com', role: 'staff' },
];

const UsersPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff accounts and roles</p>
        </div>
        <Link to="/register">
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </div>

      <SimpleCard>
        <div className="space-y-3">
          {mockUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.role === 'admin' ? <Shield className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                {user.role}
              </Badge>
            </div>
          ))}
        </div>
      </SimpleCard>
    </div>
  );
};

export default UsersPage;
