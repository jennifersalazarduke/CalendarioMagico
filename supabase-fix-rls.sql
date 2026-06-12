-- ============================================================
-- FIX: RLS race condition during family setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 0. Clean up orphaned families from failed attempts
delete from public.families
where id not in (select family_id from public.profiles where family_id is not null)
  and id not in (select family_id from public.children);


-- 1. Create an RPC function that handles the entire family+child
--    creation atomically, bypassing RLS with SECURITY DEFINER.

create or replace function public.setup_family(
  p_family_name text,
  p_child_name text
)
returns json as $$
declare
  v_family_id uuid;
  v_child_id uuid;
begin
  -- Create family
  insert into public.families (name, created_by)
  values (p_family_name, auth.uid())
  returning id into v_family_id;

  -- Link profile to family
  update public.profiles
  set family_id = v_family_id
  where id = auth.uid();

  -- Create child
  insert into public.children (family_id, name)
  values (v_family_id, p_child_name)
  returning id into v_child_id;

  -- Create default routines
  insert into public.routines (child_id, block_id, title, icon, bg_color, accent_color, sort_order)
  values
    (v_child_id, 'manana', 'Rutina de la mañana', 'sun', 'bg-morning-yellow', 'border-yellow-400', 0),
    (v_child_id, 'tarde', 'Rutina de la tarde', 'cloud-sun', 'bg-afternoon-orange', 'border-orange-400', 1),
    (v_child_id, 'noche', 'Rutina de la noche', 'moon', 'bg-night-indigo', 'border-indigo-400', 2);

  -- Create default rewards
  insert into public.rewards (family_id, name_es, icon, price)
  values
    (v_family_id, 'Elegir un postre', 'cake', 5),
    (v_family_id, 'Tiempo extra de juego', 'game', 8),
    (v_family_id, 'Escoger una película', 'movie', 10),
    (v_family_id, 'Actividad especial con mamá', 'heart', 15),
    (v_family_id, 'Pegatina sorpresa', 'star', 3);

  return json_build_object(
    'family_id', v_family_id,
    'child_id', v_child_id
  );
end;
$$ language plpgsql security definer;
