export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'generateAvatar' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Nat], []),
    'getAvatar' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat8)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
