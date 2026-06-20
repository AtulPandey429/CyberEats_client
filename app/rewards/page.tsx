'use client';



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { LoadingSpinner } from '@/components/LoadingSpinner';

import { PageHeader } from '@/components/layout/PageHeader';

import { PageShell } from '@/components/layout/PageShell';

import { RequireAuth } from '@/components/RequireAuth';

import { useToast } from '@/providers/ToastProvider';

import { isAuthenticated } from '@/lib/auth';



function useRewards() {

  const profileQuery = useQuery({

    queryKey: ['rewards-profile'],

    queryFn: async () => {

      const { data } = await api.get('/rewards/profile');

      return data.data;

    },

    enabled: isAuthenticated(),

    retry: false,

  });



  const perksQuery = useQuery({

    queryKey: ['rewards-perks'],

    queryFn: async () => {

      const { data } = await api.get('/rewards/perks');

      return data.data as Array<{ _id: string; name: string; description: string; creditCost: number }>;

    },

    enabled: isAuthenticated(),

    retry: false,

  });



  return { profileQuery, perksQuery };

}



function RewardsContent() {

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { profileQuery, perksQuery } = useRewards();



  const redeem = useMutation({

    mutationFn: async (perkId: string) => {

      const { data } = await api.post('/rewards/redeem', { perkId });

      return data.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['rewards-profile'] });

      toast('Perk redeemed!');

    },

    onError: () => toast('Redeem failed — check credits', 'error'),

  });



  const stake = useMutation({

    mutationFn: async () => {

      const { data } = await api.post('/rewards/staking/stake', { amount: 500 });

      return data.data;

    },

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['rewards-profile'] });

      toast('Staked 500 credits');

    },

    onError: () => toast('Stake failed', 'error'),

  });



  if (profileQuery.isLoading) return <LoadingSpinner label="Loading rewards..." />;



  const profile = profileQuery.data;



  return (

    <div className="space-y-8">

      <Card className="terminal-panel border-theme">

        <CardHeader>

          <CardTitle className="text-base uppercase tracking-[0.18em]">Operator profile</CardTitle>

        </CardHeader>

        <CardContent className="grid gap-4 text-sm md:grid-cols-3">

          <div>

            <p className="section-label mb-1">Credits</p>

            <p className="text-3xl font-bold text-accent">

              {profile?.creditsBalance?.toLocaleString()}

            </p>

          </div>

          <div>

            <p className="section-label mb-1">Tier</p>

            <p className="text-xl font-semibold uppercase tracking-wide">{profile?.tier}</p>

          </div>

          <div>

            <p className="section-label mb-1">Referral</p>

            <p className="font-mono text-xs text-accent/90">{profile?.referralCode}</p>

          </div>

        </CardContent>

      </Card>



      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="section-label text-accent">Perk catalog</h2>

          <Button size="sm" variant="outline" disabled={stake.isPending} onClick={() => stake.mutate()}>

            Stake 500 credits

          </Button>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {perksQuery.data?.map((perk) => (

            <Card key={perk._id} className="terminal-panel">

              <CardHeader>

                <CardTitle className="text-base uppercase tracking-wide">{perk.name}</CardTitle>

              </CardHeader>

              <CardContent className="space-y-3">

                <p className="text-sm text-muted">{perk.description}</p>

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-accent">

                    {perk.creditCost.toLocaleString()} credits

                  </span>

                  <Button

                    size="sm"

                    disabled={redeem.isPending}

                    onClick={() => redeem.mutate(perk._id)}

                  >

                    Redeem

                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </section>

    </div>

  );

}



export default function RewardsPage() {

  return (

    <RequireAuth>

      <PageShell>

        <PageHeader

          status="Loyalty grid"

          title="Rewards"

          subtitle="Redeem credits, stake for perks, and climb operator tiers."

        />

        <RewardsContent />

      </PageShell>

    </RequireAuth>

  );

}


