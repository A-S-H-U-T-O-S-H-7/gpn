import { useCallback } from 'react';
import useAdminAuthStore from '@/lib/stores/useAdminAuthStore';
import { logActivity } from '@/lib/services/activityLogService';

export const useActivityLogger = () => {
  const { admin } = useAdminAuthStore();

  const log = useCallback(async ({ action, entityType, entityId, entityTitle, oldData, newData, details }) => {
    return await logActivity({
      action,
      entityType,
      entityId,
      entityTitle,
      oldData,
      newData,
      details,
      adminId: admin?.id || admin?.uid,
      adminName: admin?.name || admin?.username,
      adminRole: admin?.role,
    });
  }, [admin]);

  return { log };
};