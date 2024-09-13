import { signOut as naSignOut } from '@/auth';
import { signOut } from '@/auth/utils';

jest.mock('@/auth', () => ({
  signOut: jest.fn(),
}));

describe('signOut', () => {
  it('should call naSignOut with correct arguments', async () => {
    const mockNaSignOut = naSignOut as jest.Mock;

    await signOut();

    expect(mockNaSignOut).toHaveBeenCalledWith({ redirectTo: '/' });
    expect(mockNaSignOut).toHaveBeenCalledTimes(1);
  });

  it('should handle errors if naSignOut fails', async () => {
    const mockNaSignOut = naSignOut as jest.Mock;
    mockNaSignOut.mockRejectedValueOnce(new Error('Failed to sign out'));

    await expect(signOut()).rejects.toThrow('Failed to sign out');
  });
});
