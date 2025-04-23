import styled from 'styled-components';

// styled-components
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 64;
  background-color: #1f2937;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #374151;
  z-index: 40;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  @media (max-width: 768px) {
    width: 100%;
  }
    @media (min-width: 768px) {
    display: none;
  }

  ${(props) =>
    props.isopen === "true" ? 
    `
      transform: translateX(0);
      transform: translateY(66px);
    `
    :
    ''
  }
`;