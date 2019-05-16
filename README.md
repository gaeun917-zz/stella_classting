#광고 성과보고서 

## Dev Stack 
프레임워크, preprocessor (scss, babel, webpack)등 사용없이 로직에 중심입니다. 그래프는 d3와 metrics-graphics를 사용하였고, 
csv 파싱을 위해서 PapaParse를, date 파싱을 위해서 moment를 사용하였습니다. 


## How to Use!

1. csv 파일을 업로드 합니다. 
    
2. 2개의 차트가 만들어 집니다. 
    
  * 첫번째 차트는 사용자(역할) 별 해당 기간의 전체 합계와 평균값을 나타내는 bar chart 입니다. 
  * 두번째 차트는 사용자 별 해당기간의 click, view, watch 를 나타내는 line chart 입니다. 
    * 디폴트 값은 선생님과 전체 기간으로 설정되어 있습니다.
    * 모든 사용자의 전체 기간 동안의 총 합계와 평균을 확인하고 싶다면 user 필터의 all을 선택하면 됩니다. 
    * 업로드 한 파일에서 특정기간의 합계 및 총합을 확인하고 싶다면 start date와 end date 값을 조정하면 됩니다. 
    

made with love,

이가은, Stella Lee

 [link to Github](https://github.com/gaeun917/stella_classting)
